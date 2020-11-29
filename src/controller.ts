import dotenv, { config } from "dotenv"
import express from "express";
import mongoose, { Document, Schema } from "mongoose";

import Products from "../schema/productSchema";
import Variants from "../schema/variantSchema";
import Orders from "../schema/orderSchema";
import User from "../schema/userSchema";

/*
// dotenv config parsing env variables
dotenv.config();

// mongoose connection to db
mongoose.connect(process.env.DB_URI, {
        dbName: process.env.DB_NAME,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Successfully connected to database");
    }
});

export class ProductController {
    public getAllProducts(req: express.Request, res: express.Response): void {
        const products = Products.find((err: any, products: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(products);
            }
        });
    }

    // get specific product using productId as params
    public getProduct(req: express.Request, res: express.Response): void {
        Products.findById(req.params.productId, (err: any, product: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(product);
            }
        });
    }

    public createProduct(req: express.Request, res: express.Response): void {
        const prodinfo = [];
        let prodVariant: Array<Object> = []  // keeps track of each variant name for the product
        let varIdArr: Array<any> = []
        let parentProdId = new mongoose.Types.ObjectId()

        // create variants for product and store their variant ids in array for use in 
        for (const variantObj of req.body.variants) {

            let variantId = new mongoose.Types.ObjectId()
            varIdArr.push(variantId)

            console.log(variantObj)

            const variant = new Variants({
                _id: variantId,
                name: variantObj.name,
                parentProductId: parentProdId,
                price: variantObj.price,
                quantity: variantObj.quantity
            })
            variant.save();
        }

        const product = new Products({
            _id: parentProdId,
            name: req.body.name,
            variantIds: varIdArr,
            description: req.body.description,
            images: ["img_1"]
        });
        product.save((err: any) => {
            if (err) {
                res.send(err);
            } else {
                res.status(201).json({
                    message: "Product created successfully",
                    createdProduct: {
                        name: req.body.name,
                        variants: req.body.variants
                    }
                });
            }
        });
    }

    public updateProduct(req: express.Request, res: express.Response): void {
        const id = req.params.productId;
        const updateOps: {[update: string]: Array<Object>} = {};

        for (const update of Object.keys(req.body)) { 


            //Store each "key": "value to be changed" from the request body into map 
            updateOps[update] = req.body[update]

            // if there is key: [Array of schemas. In this case "variants": [Array of variant schemas]
            if(Array.isArray(updateOps[update])) { 

                //for each variant in [array of variants to be changed]
                for (const array_item of updateOps[update]) {

                    // to store each variant key:value passed in to be changed
                    let variant_items: {[item: string]: any} = {}

                    // to store variantId of variant to be updated
                    let variant_id = null

                    // whether or not existing variantId was passed in
                    let id_bool = false

                    //if variant ObjectId was provided in body arguments (so we are updating an existing variant)
                    if("_id" in array_item) {
                        console.log("EXISTING VARIANT")
                        variant_id = Object.values(array_item)[Object.keys(array_item).indexOf("_id")]
                        id_bool = true
                    } else {
                        console.log("NEW VARIANT")
                        variant_id = new mongoose.Types.ObjectId()
                    }

                    // two different key structures for update values depending on variant add or variant update.
                    for (let item_key in array_item) {
                        let item_key_update = null
 
                        if(id_bool) {
                            // structure of key: value, "variant.$.name": "some_name". Used for updating existing variant
                            item_key_update = update.concat(".$.", item_key)
                        } 
                        else {
                            // structure of key: value, "name": "some_name". Used for creating new variant
                            item_key_update = item_key
                        }
                        variant_items[item_key_update] = Object.values(array_item)[Object.keys(array_item).indexOf(item_key)]
                    }

                    if (!id_bool) {
                        //add new variant to the product using $push
                        Products.findOneAndUpdate(
                            {_id: id}, 
                            {$push: {
                                    "variants": {
                                        $each: [ variant_items ] //variant add key:values
                                    }
                                }
                            }, 
                            {upsert: true}, (err, result) => {
                                if(err ){
                                    console.log(err)
                                } else {
                                    console.log("Variant was created and added!")
                                }
                            }
                        )
                    } else {
                        //update existing variant of product
                        Products.findOneAndUpdate(
                            {_id: id, "variants._id": variant_id}, 
                            variant_items,  //variant update key:values
                            {new: true, upsert:true}, (err, result) => {
                            if(err){
                                console.log(err)
                            } else {
                                console.log("Variant was updated!")
                            }
                        })
                    }
                }
            }
            else {
                // if we want to update existing key: single value
                let update_obj: {[update: string]: any} = {}
                update_obj[update] = updateOps[update]

                console.log(update_obj)
                Products.findOneAndUpdate(
                    {_id: id}, 
                    update_obj, //update key: single value
                    {new: true, upsert:true}, (err, result) => {
                    if(err ){
                        console.log(err)
                    } else {
                        console.log("success")
                    }
                })
            }
        }

        res.send()

    }
    public deleteProduct(req: express.Request, res: express.Response): void {
        const id = req.params.productId;

        Products.remove({_id: id}, function (err) {
            if(err) {   
                res.send(err); 
            } else {
                res.send("Successfully deleted product");
            }
        });
    }

    public deleteVariant(req: express.Request, res: express.Response): void {
        const id = req.params.variantId;

        Products.deleteOne({_id: id}, function (err) {
            if(err) {   
                res.send(err); 
            } else {
                res.send("Successfully deleted variant");
            }
        });
    }

}

/*
export class CustomerController {
    public getAllCustomers(req: express.Request, res: express.Response): void {
        const customers = Customers.find((err: any, customers: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(customers);
            }
        });
    }
    public getCustomer(req: express.Request, res: express.Response): void {
        Customers.findById(req.params.customerId, (err: any, customer: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(customer);
            }
        });
    }
    public addCustomer(req: express.Request, res: express.Response): void {
        // create customer using Customer schema
        const customer = new Customers({
            name: req.body.name,
            email: req.body.email
        });

        // validate and save customer
        customer.save((err: any) => {
            if (err) {
                res.send(err);
            } else {
                res.status(201).json({
                    message: "Customer created successfully",
                    createdCustomer: {
                        name: req.body.name,
                        email: req.body.email
                    }
                });
            }
        });
    }
}*/
import express from "express";
import mongoose, { Document, Schema } from "mongoose";

import Products from "../schema/productSchema";
import Variants from "../schema/variantSchema";
import Orders from "../schema/orderSchema";
import User from "../schema/userSchema";


export class ProductController {
    public getAllProducts(req: express.Request, res: express.Response): void {
        Products.find()
        .populate('variantIds')
        .exec()
        .then(products => {
            res.send(products)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
              error: err
            });
        });
    }

    // get specific product using productId as params
    public getProduct(req: express.Request, res: express.Response): void {
        let prodId = req.params.productId
        Products.find({'_id': prodId})
        .populate('variantIds')
        .exec()
        .then(product=> {
            if (product.length < 1) {
              return res.status(409).json({
                error: "Product not found for the productId"
              });
            } else {
                res.send(product);
            }
        });
    }

    // creates product and requires ATLEAST 1 variant. Does not create products with duplicate names
    public createProduct(req: express.Request, res: express.Response): void {
        const prodinfo = [];
        let prodVariant: Array<Object> = []  // keeps track of each variant name for the product
        let varIdArr: Array<any> = []
        let parentProdId = new mongoose.Types.ObjectId()

        Products.find({name: req.body.name})
        .exec()
        .then(product=> {
            if (product.length >= 1) {
              return res.status(409).json({
                message: "Product already exists with that name"
              });
            } else {
                const prodinfo = [];
                let prodVariant: Array<Object> = []  // keeps track of each variant name for the product
                let varIdArr: Array<any> = []
                let parentProdId = new mongoose.Types.ObjectId()
                
                for (const variantObj of req.body.variants) {

                    let variantId = new mongoose.Types.ObjectId()
                    varIdArr.push(variantId)
        
                    console.log(variantObj)
        
                    const variant = new Variants({
                        _id: variantId,
                        name: variantObj.name,
                        parentProductId: parentProdId,
                        price: variantObj.price,
                        quantity: variantObj.quantity,
                        images: variantObj.images
                    })
                    variant.save();
                }
        
                const product = new Products({
                    _id: parentProdId,
                    name: req.body.name,
                    variantIds: varIdArr,
                    description: req.body.description,
                    categories: req.body.categories,
                    images: req.body.images
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
        });
    }

    // update fields for a product. Does not update the individual variant field values (use /editVariants route to edit variants data)
    public updateProduct(req: express.Request, res: express.Response): void {
        console.log("Update Prod called")
        const prodId = req.params.productId;
        const updateOps: {[update: string]: Array<Object>} = {};

        for (const update of Object.keys(req.body)) { 
            //Store each "key": "value to be changed" from the request body into map 
            updateOps[update] = req.body[update]
        }

        Products.findOneAndUpdate({'_id': prodId}, {'$set': updateOps}, function(err) {
            if (err) {
                res.send(err)
            } else {
                res.status(201).json({
                    message: "Product updated successfully"
                });
            }
        })
    }

    // deletes product and any of its linking variants
    async deleteProduct(req: express.Request, res: express.Response) {
        try {
            let product: any = await Products.findOne({ _id: req.params.productId}).exec()
            const listToDelete = [...product.variantIds]
            await Products.deleteOne({ _id: req.params.productId}).exec()
            await Variants.remove({_id: {$in: listToDelete}}).exec()
            res.send("Success")
        } catch(e) {
            res.status(500).json({
                error: e.toString()
            });
        }      
    }
}
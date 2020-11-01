import express from "express";
import mongoose, { Schema, Document } from 'mongoose'; 
import Products from "../schema/productSchema";
import Customers from "../schema/customerSchema";


//Connection string to cloud db
const uri: string = 
    'mongodb+srv://user_1:dprD43S8Ukkxm0iX@ecomproj.ynpce.mongodb.net/store?retryWrites=true&w=majority'

mongoose.set('useUnifiedTopology', true);


// mongoose connection to db
mongoose.connect(uri, { useNewUrlParser: true }, (err: any) => {
    if(err) {   
        console.log(err.message)
    }else{
        console.log("Successfully connected to database")
    }
})

export class ProductController {
    public getAllProducts(req: express.Request, res: express.Response): void {
        let products = Products.find((err: any, products: any) => {
            if (err){
                res.send(err)
            } else {
                res.send(products)
            }
        })
    }

    //get specific product using productId as params
    public getProduct(req: express.Request, res: express.Response): void {
        Products.findById(req.params.productId, (err: any, product: any) =>{
            if(err) {
                res.send(err)
            } else {
                res.send(product)
            }
        })
    }

    public addProduct(req: express.Request, res: express.Response): void {
        // get all variants for product from request body
        let prodinfo = []
        for(let variant of req.body.variants){
            prodinfo.push(variant)
        }

        //create product using schema
        let product = new Products({
            name: req.body.name,
            variants: prodinfo
        });

        //validate and save product
        product.save((err: any) => {
            if(err) {
                res.send(err)
            } else {
                res.status(201).json({
                    message: "Product created successfully",
                    createdProduct: {
                        name: req.body.name,
                        variants: req.body.variants
                    }
                });
            }
        })
    }

    public updateProduct(req: express.Request, res: express.Response): void {
        const id = req.params.productId;
        res.send(id)
    }
}

export class CustomerController {
    public getAllCustomers(req: express.Request, res: express.Response): void {
        let customers = Customers.find((err: any, customers: any) =>{
            if(err) {
                res.send(err)
            } else {
                res.send(customers)
            }
        })
    }
    public getCustomer(req: express.Request, res: express.Response): void{
        Customers.findById(req.params.customerId, (err: any, customer: any) =>{
            if(err) {
                res.send(err)
            } else {
                res.send(customer)
            }
        })
    }
    public addCustomer(req: express.Request, res: express.Response): void {
        // create customer using Customer schema
        let customer = new Customers({
            name: req.body.name,
            email: req.body.email
        });

        // validate and save customer
        customer.save((err: any) => {
            if(err) {
                res.send(err)
            } else {
                res.status(201).json({
                    message: "Customer created successfully",
                    createdCustomer: {
                        name: req.body.name,
                        email: req.body.email
                    }
                });
            }
        })
    }
}
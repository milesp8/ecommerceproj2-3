import dotenv, { config } from "dotenv"
import express from "express";
import mongoose, { Document, Schema } from "mongoose";
import Customers from "../schema/customerSchema";
import Products from "../schema/productSchema";
import Orders from "../schema/orderSchema";

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

    public addProduct(req: express.Request, res: express.Response): void {
        // get all variants for product from request body
        const prodinfo = [];
        for (const variant of req.body.variants) {
            prodinfo.push(variant);
        }

        // create product using schema
        const product = new Products({
            name: req.body.name,
            variants: prodinfo
        });

        // validate and save product
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
        res.send(id);
    }
}

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
}
export class OrderController {
    public getAllOrders(req: express.Request, res: express.Response): void{
        const orders = Orders.find((err: any, products: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(products);
            }
        });
    }
    public getOrder(req: express.Request, res: express.Response): void {
        Orders.findById(req.params.orderId, (err: any, order: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(order);
            }
        });
    }
    public deleteOrder(req: express.Request, res: express.Response): void{
        Orders.findById(req.params.orderId, (err: any, order: any) => {
            if (err){
                res.send(err);
            } else {
                Orders.remove(order);
            }
        });
    }
    public addOrder(req: express.Request, res: express.Response): void{
        const order = new Orders({
            name: req.body.name,
            variants: req.body.variants
        });

        // validate and save order
        order.save((err: any) => {
            if (err) {
                res.send(err);
            } else {
                res.status(201).json({
                    message: "Order created successfully",
                    createdOrder: {
                        name: req.body.name,
                        variants: req.body.variants
                    }
                });
            }
        });
    }
}

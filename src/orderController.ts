import express from "express";
import mongoose, { Document, Schema } from "mongoose";

import Products from "../schema/productSchema";
import Variants from "../schema/variantSchema";
import Orders from "../schema/orderSchema";
import User from "../schema/userSchema";



export class OrderController {

    public getAllOrders(req: express.Request, res: express.Response): void{
        const orders = Orders.find((err: any, orders: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(orders);
            }
        });
    }

    // specific order by orderId
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
                Orders.remove(order)
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                    error: err
                    });
                });;
            }
        });
    }
    public createOrder(req: express.Request, res: express.Response): void{

        const orderInfo = [];
        for (const item_order of req.body.products) {
            orderInfo.push(item_order);
        }

        const order = new Orders({
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            total: req.body.total,
            items: req.body.products,
            deliverydate: req.body.deliverydate
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
                        products: req.body.products
                    }
                });
            }
        });
    }
}
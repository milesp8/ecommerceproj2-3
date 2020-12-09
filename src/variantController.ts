import express from "express";
import mongoose, { Document, Schema } from "mongoose";

import Products from "../schema/productSchema";
import Variants from "../schema/variantSchema";
import Orders from "../schema/orderSchema";
import User from "../schema/userSchema";



export class VariantsController {
    // get variants for either 1 single product (using parent product id) or different variants using array of variant id's
    public getVariants(req: express.Request, res: express.Response): void {
        const parentProdId = req.params.parentProdId
        // parent product id is passed in optionally. If not array of variant id's is required
        if (parentProdId == undefined) {
            let variantIds = req.body.variants

            Variants.find({'_id': {"$in": variantIds}}, function(err, variants){
                if (err) {
                    res.send(err)
                } else {
                    res.send(variants)
                }
            });
        }
        else {
            Products.find({'_id': parentProdId})
            .exec()
            .then(product=> {
                if (product.length < 1) {
                    return res.status(409).json({
                      error: "Product not found for the productId"
                    });
                } else {
                    Variants.find({'parentProductId': parentProdId}, function(err, variants){
                        if (err) {
                            res.send(err)
                        } else {
                            res.send(variants)
                        }
                    });
                }
            });
        }
    }

    // add variants for a certain product 
    public createVariants(req: express.Request, res: express.Response): void {
        const parentProdId = mongoose.Types.ObjectId(req.params.parentProdId)

        // create each new variant
        let variantIdArr: any = []
        Products.find({'_id': parentProdId}) 
        .exec()
        .then(product=> {
            console.log(product)
            if (product.length < 1) {
                console.log("NO PARENT FOUND")
                return res.status(409).json({
                    message: "Product does not exist for the product id"
                });
            } else {
                for (let variantIndex in req.body.variants) {
                    let variantId = new mongoose.Types.ObjectId()
                    variantIdArr.push(variantId)

                    const variant = new Variants({
                        _id: variantId,
                        name: req.body.variants[variantIndex].name,
                        parentProductId: parentProdId,
                        price: req.body.variants[variantIndex].price,
                        quantity: req.body.variants[variantIndex].quantity,
                        images: req.body.variants[variantIndex].images
                    })

                    variant.save()
                }

                // push all new variantIds to product variantId array
                Products.findOneAndUpdate({'_id': parentProdId}, {'$push': {variantIds: {'$each': variantIdArr}}}, function(err, product) {
                    if (err) {
                        res.send(err)
                    } else {
                        res.send("Success")
                    }
                })
            }
        })
    }

    // update variants by variant ids for different products (not just for single product)
    public updateVariants(req: express.Request, res: express.Response): void {
        let variant: any
        let newVariantId: Array<any> = []
        let prodId = req.params.productId

        let updateOps: {[update: string]: any} = {};
        /*
        for (let updateVar in req.body.variants) {

            console.log(updateVar)

            if (req.body.variants[updateVar]._id) {
                Variants.findOneAndUpdate({"_id": req.body.variants[updateVar]._id}, {"$set": req.body.variants[updateVar]})
                .exec();
            } else {
                console.log("Variant Id not found")
            }
        }*/

        Variants.findOneAndUpdate({"_id": req.body._id}, 
        {"name": req.body.name,
        "price": req.body.price,
        "quantity": req.body.quantity, 
        "images": req.body.images}).exec()

        res.status(200).json({
            message: "Variants edited and updated successfully"
        })
    }

    // delete variants of any product and their references in from their parent products
    async deleteVariants(req: express.Request, res: express.Response) {

        try {
        
            let varIds: any = []
            let parentProdIds: any = []
            for (let variantIndex in req.body.variants) {
                varIds.push(req.body.variants[variantIndex])
                let variant: any = await Variants.findOne({ _id: varIds[0]}).exec()

                parentProdIds.push(variant.parentProductId)

            }
            Variants.deleteMany({'_id': {'$in': varIds}}).exec()

            Products.updateMany({'_id': {'$in': parentProdIds}}, {'$pull': {variantIds: {'$in': varIds}}}, function(err) {
                if(err) {
                    res.send(err)
                } else {
                    res.status(201).json({
                        message: "Variants successfully removed"
                    });
                }
            })
        } catch(e) {
            res.status(500).json({
                error: e.toString()
            });
        }    
    }

}
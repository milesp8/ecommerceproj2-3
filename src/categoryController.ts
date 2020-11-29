import express from "express";
import mongoose, { Document, Schema } from "mongoose";

import Products from "../schema/productSchema";
import Variants from "../schema/variantSchema";
import Orders from "../schema/orderSchema";
import User from "../schema/userSchema";
import Categories from "../schema/categorySchema";




export class CategoryController {
    // gets either 1 category by req.params.categoryId passed in or multiple categories according to array of categoryId's from req.body
    public getCategories(req: express.Request, res: express.Response): void{

        if (req.params.categoryId != undefined) {
            Categories.find({'_id': req.params.categoryId})
            .exec()
            .then(category=> {
                if (category.length < 1) {
                    return res.status(500).json({
                        error: "No category was found for the category Id"
                    });
                } else {
                    res.send(category)
                }
            })      
        } else {
            Categories.find({'_id': {'$in': req.body.categories}})
            .exec()
            .then(categories=> {
                if (categories.length < 1) {
                    return res.status(500).json({
                        error: "No categories were found for array of Category Ids"
                    });
                } else {
                    res.send(categories)
                }
            })       
        }
    }

    public getAllCategories(req: express.Request, res: express.Response): void{
        Categories.find((err: any, categories: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(categories);
            }
        });
    }

    // creaates new category. Does not allow categories with duplicate names
    public createCategory(req: express.Request, res: express.Response): void{
        Categories.find({name: req.body.name})
        .exec()
        .then(category=> {
            if (category.length >= 1) {
              return res.status(409).json({
                error: "Another Category with the same name exists"
              });
            } else {
                const category = new Categories({
                    name: req.body.name,
                    products: req.body.products,
                    image: req.body.image
                })
        
                category.save((err: any) => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.status(201).json({
                            message: "Category created successfully",
                            createdCategory: {
                                name: req.body.name,
                            }
                        });
                    }
                });
            }
        })     
    }

    // UNDER WORK
    public updateCategory(req: express.Request, res: express.Response): void{
        let categoryId = req.params.categoryId

        Categories.findOneAndUpdate({'_id': categoryId}, {'$set': req.body}, function(err) {
            if(err){
                res.send(err)
            } else {
                res.status(200).json({
                    message: "Category successfully updated"
                })
            }
        })

    }

    // deletes category and all the references it has in respective products
    public deleteCategory(req: express.Request, res: express.Response): void{

        let categoryId = req.params.categoryId

        Categories.find({'_id': categoryId})
        .exec()
        .then(category=> {
            if (category.length < 1) {
              return res.status(500).json({
                error: "Category does not exist for the categoryId"
              });
            } else {

                Products.updateMany({categories: categoryId}, { $pullAll: {categories: [categoryId]}})

                Categories.remove({'_id': categoryId}, function(err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.status(201).json({
                            message: "Category deleted successfully",
                        });
                    }
                })
            }
        })
    }
 
}

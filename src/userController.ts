import express from "express";
import mongoose, { Document, Schema } from "mongoose";

import Products from "../schema/productSchema";
import Variants from "../schema/variantSchema";
import Orders from "../schema/orderSchema";
import User from "../schema/userSchema";
import * as bcrypt from 'bcrypt'; 
import * as jwt from 'jsonwebtoken';



export class UserController {
    public login(req: express.Request, res: express.Response): void{
        User.findOne({ email: req.body.email }, function(err, user: any) {
            if (err) {
                res.send(err)
            } else {
                if (user == null) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                //console.log(user.password)
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                    }
                    if (result) {
                        const token = jwt.sign(
                            {
                                email: user.email,
                                userId: user._id
                            }, process.env.JWT_KEY,
                            {
                                expiresIn: "5h"
                            }
                    );
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    });
                    }
                    res.status(401).json({
                    message: "Auth failed"
                    });
                });
            }
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
    }
    
    public register(req: express.Request, res: express.Response): void{
        
        User.find({email: req.body.email})
        .exec()
        .then(user=> {
            if (user.length >= 1) {
              return res.status(409).json({
                message: "Mail exists"
              });
            } else {
              bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                  return res.status(500).json({
                    error: err
                  });
                } else {
                  const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                  });
                  user.save()
                    .then(result => {
                      console.log(result);
                      res.status(201).json({
                        message: "User created"
                      });
                    })
                    .catch(err => {
                      console.log(err);
                      res.status(500).json({
                        error: err
                      });
                    });
                }
              });
            }
          });
    }
}
import * as jwt from 'jsonwebtoken';
import express from "express"; 


module.exports = (req, res, next) => {
    try {
        console.log("CHECK AUTH REACHED")
        console.log("TOKEN", req.headers.authorization)
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        console.log("CHECK AUTH SUCCESSFUL")
        next();
    } catch (error) {
        console.log("CHECK AUTH ERROR")
        return res.status(401).json({
            error: 'Auth failed'
        });
    }
};
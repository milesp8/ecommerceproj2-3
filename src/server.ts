import bodyParser from "body-parser";
import express from "express";
import { Session } from "inspector";

import {ApiRouter} from "./router";
import dotenv, { config } from "dotenv"
import mongoose, { Document, Schema } from "mongoose";

class Application {
    public app: express.Application;
    public port: number;

    constructor() {
        this.app = express();
        this.port = +process.env.serverPort || 3000;
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.initCors();

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
    }
    // Starts the server on the port specified in the environment or on port 3000 if none specified.
    public start(): void {
        this.buildRoutes();
        this.app.listen(this.port, () => console.log("Server listening on port " + this.port + "!"));
    }

    // sets up to allow cross-origin support from any host.  You can change the options to limit who can access the api.
    // This is not a good security measure as it can easily be bypassed,
    // but should be setup correctly anyway.  Without this, angular would not be able to access the api it it is on
    // another server.
    public initCors(): void {
        this.app.use(function(req: express.Request, res: express.Response, next: any) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
            res.header("Access-Control-Allow-Credentials", "true");

            if ('OPTIONS' == req.method) {
                res.sendStatus(200);
            } else {
                console.log('${req.ip} ${req.method} ${req.url}')
                next();
            }
        });
    }
    // setup routes for the express server
    public buildRoutes(): void {
        this.app.use("/api", new ApiRouter().getRouter());
    }
}
new Application().start();

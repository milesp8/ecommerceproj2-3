import express from "express";

export class Controller {
    public getHello(req: express.Request, res: express.Response): void {
        res.send("Hello World");
    }
    public getUser(req: express.Request, res: express.Response): void{
        res.send("Info of all users")
    }
    public postHello(req: express.Request, res: express.Response): void {
        res.send(req.body);
    }
}

import express from "express";
import { ProductController, CustomerController } from "./controller";

export class ApiRouter {
    private router: express.Router = express.Router();
    private prodController: ProductController = new ProductController();
    private custController: CustomerController = new CustomerController();


    // Creates the routes for this router and returns a populated router object
    public getRouter(): express.Router {

        //product routes
        this.router.get("/product/:productId", this.prodController.getProduct)
        this.router.get("/allProducts", this.prodController.getAllProducts)
        this.router.post("/addProduct", this.prodController.addProduct)
        this.router.patch("/updateProduct/:productId", this.prodController.updateProduct)

        //customer routes
        this.router.get("/allCustomers", this.custController.getAllCustomers)
        this.router.get("/customer/:customerId", this.custController.getCustomer)
        this.router.post("/addCustomer", this.custController.addCustomer)

        return this.router;
    }
}

import express from "express";
import { ProductController } from "./productController";
import { VariantsController } from "./variantController";
import { OrderController } from "./orderController";
import { UserController } from "./userController";
import { CategoryController } from "./categoryController";


export class ApiRouter {
    private router: express.Router = express.Router();
    private prodController: ProductController = new ProductController();
    private orderController: OrderController = new OrderController();
    private userController: UserController = new UserController();
    private variantController: VariantsController = new VariantsController()
    private categoryController: CategoryController = new CategoryController()
    private checkAuth = require('../middleware/check_auth');

    // Creates the routes for this router and returns a populated router object
    public getRouter(): express.Router {

        // product routes
        this.router.get("/product/:productId", this.prodController.getProduct);
        this.router.get("/allProducts", this.prodController.getAllProducts);
        this.router.post("/addProduct", this.checkAuth, this.prodController.createProduct);
        this.router.post("/updateProduct/:productId", this.checkAuth, this.prodController.updateProduct);
        this.router.delete("/deleteProduct/:productId", this.checkAuth, this.prodController.deleteProduct);

        // variant routes
        this.router.get("/getVariants/:parentProdId?", this.variantController.getVariants)
        this.router.post("/addVariants/:parentProdId", this.checkAuth, this.variantController.createVariants)
        this.router.post("/updateVariants", this.checkAuth, this.variantController.updateVariants)
        this.router.delete("/deleteVariants", this.checkAuth, this.variantController.deleteVariants)

        // category routes
        this.router.get("/category/:categoryId?", this.categoryController.getCategories)
        this.router.get("/getAllCategories", this.categoryController.getAllCategories)
        this.router.post("/createCategory", this.checkAuth, this.categoryController.createCategory)
        this.router.post("/updateCategory/:categoryId", this.checkAuth, this.categoryController.updateCategory)
        this.router.delete("/deleteCategory/:categoryId", this.checkAuth, this.categoryController.deleteCategory)

        // order routes
        this.router.get("/allOrders", this.orderController.getAllOrders);
        this.router.get("/order/:orderId", this.checkAuth, this.orderController.getOrder);
        this.router.post("/addOrder", this.orderController.createOrder);
        this.router.delete("/deleteOrder/:orderId", this.orderController.deleteOrder);

        // user routes
        this.router.post("/login", this.userController.login);
        this.router.post("/register", this.userController.register);

        //check if auth valid 
        this.router.post("/auth", this.checkAuth, function() {
            return {message: "Auth successful"}
        });

        /*
        // customer routes
        this.router.get("/allCustomers", this.custController.getAllCustomers);
        this.router.get("/customer/:customerId", this.custController.getCustomer);
        this.router.post("/addCustomer", this.custController.addCustomer);*/

        return this.router;
    }
}

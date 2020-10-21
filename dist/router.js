"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
class ApiRouter {
    constructor() {
        this.router = express_1.default.Router();
        this.controller = new controller_1.Controller();
    }
    // Creates the routes for this router and returns a populated router object
    getRouter() {
        this.router.get("/hello", this.controller.getHello);
        this.router.post("/hello", this.controller.postHello);
        return this.router;
    }
}
exports.ApiRouter = ApiRouter;
//# sourceMappingURL=router.js.map
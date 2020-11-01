"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//Connection string to cloud db
const uri = 'mongodb+srv://user_1:dprD43S8Ukkxm0iX@ecomproj.ynpce.mongodb.net/<dbname>?retryWrites=true&w=majority';
mongoose_1.default.set('useUnifiedTopology', true);
// mongoose connection to db
mongoose_1.default.connect(uri, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log("Successfully connected to database");
    }
});
class Controller {
    getHello(req, res) {
        res.send("Hello World");
    }
    getUser(req, res) {
        res.send("Info of all users");
    }
    postHello(req, res) {
        res.send(req.body);
    }
}
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map
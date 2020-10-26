"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
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
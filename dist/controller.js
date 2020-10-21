"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Controller {
    getHello(req, res) {
        res.send("Hello World");
    }
    postHello(req, res) {
        res.send(req.body);
    }
}
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map
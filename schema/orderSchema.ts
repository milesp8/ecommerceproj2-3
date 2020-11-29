import mongoose, { Schema } from "mongoose";

/*
export const OrderItemSchema = new mongoose.Schema({
    product: {type: String, required: true},
    variant: {type: String, required: true},
    productId: {type: String, required: true},
    variantId: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true}
});*/

// schema for each customer
export const OrderSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    address: {type: String, required: true},
    total: {type: Number, required: true},
    items: {type: [[Object, String, Object, String, Number]], default: undefined, required: true},
    deliverydate: {type: String, required: true}
});

// export customer schema as model
const Orders = mongoose.model("Order", OrderSchema);
export default Orders;

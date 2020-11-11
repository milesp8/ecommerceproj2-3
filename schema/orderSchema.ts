import mongoose, { Schema } from "mongoose";

export const OrderItemSchema = new mongoose.Schema({
    product: {type: String, required: true},
    variant: {type: String, required: true},
    productId: {type: Number, required: true},
    variantId: {type: Number, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true}
});

// schema for each customer
export const OrderSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    address: {type: String, required: true},
    total: {type: Number, required: true},
    products: {type: [OrderItemSchema], default: undefined, required: true}

});

// export customer schema as model
const Orders = mongoose.model("Order", OrderSchema);
export default Orders;

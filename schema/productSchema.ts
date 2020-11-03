import mongoose, { Schema } from "mongoose";

// Schema for each variant
export const ProdInfoSchema = new mongoose.Schema({
    variant: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true}
});

// schema for each prodcut
export const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true},

    // stores array of variant schemas for that product
    variants: {type: [ProdInfoSchema], default: undefined, required: true}
});

// export product schema as model
const Products = mongoose.model("Product", ProductSchema);
export default Products;

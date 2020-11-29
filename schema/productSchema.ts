import mongoose, { Schema } from "mongoose";

// schema for each prodcut
export const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true},
    variantIds: [{type: mongoose.Types.ObjectId, default: undefined, ref:'Variants'}],
    description: {type: String},
    images: [{type: String}],
    categories: [{type: mongoose.Types.ObjectId, required:false}]
});

// export product schema as model
const Products = mongoose.model("Product", ProductSchema);
export default Products;

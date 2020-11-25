import mongoose, { Schema } from "mongoose";

export const CategorySchema = new mongoose.Schema({
    name: {type: String, required: true},
    productIds : {type: [String], required: true},
    picurl: {type: String}
});

const Categories = mongoose.model("Category", CategorySchema);
export default Categories;

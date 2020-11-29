import mongoose, { Schema } from "mongoose";

export const CategorySchema = new mongoose.Schema({
    name: {type: String, required: true},
    products : [{type: mongoose.Schema.Types.ObjectId, required: true, ref:'Products'}],
    image: {type: String}
});

const Categories = mongoose.model("Category", CategorySchema);
export default Categories;

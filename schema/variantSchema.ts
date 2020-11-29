import mongoose, { Schema } from "mongoose";


export const VariantSchema = new mongoose.Schema({
    name: {type: String, required: true},
    parentProductId: {type: mongoose.Schema.Types.ObjectId, index: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    images: {type: [String]}
});

const Variants = mongoose.model("Variants", VariantSchema);
export default Variants;

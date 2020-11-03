import mongoose, { Schema } from "mongoose";

// schema for each customer
export const CustomerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true}
});

// export customer schema as model
const Customers = mongoose.model("Customer", CustomerSchema);
export default Customers;

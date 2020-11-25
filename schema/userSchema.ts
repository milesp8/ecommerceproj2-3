import mongoose, { Schema } from "mongoose";


export const UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password : {type: String, required: true}
});

const Users = mongoose.model("User", UserSchema);
export default Users;

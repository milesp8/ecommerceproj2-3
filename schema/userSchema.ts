import mongoose, { Schema } from "mongoose";


export const UserSchema = new mongoose.Schema({
    email: {type: String, required: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password : {type: String, required: true}
});

const Users = mongoose.model("Users", UserSchema);
export default Users;

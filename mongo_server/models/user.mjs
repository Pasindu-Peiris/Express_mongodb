import { model, Schema } from "mongoose";

const userModel = new Schema({
    name: String,
    username: String,
    email: String,
    password: String,
},
    { timestamps: true }
)

const User = model("User", userModel);
export default User;
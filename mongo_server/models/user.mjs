import { model, Schema } from "mongoose";

const userModel = new Schema({

    name: {
        type: String,
        required: true,
        unique: true,

    },
    username: String,
    email: String,
    password: String,
},
    { timestamps: true }
)

const User = model("User", userModel);
export default User;
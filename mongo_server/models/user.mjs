import { model, Schema, Types } from "mongoose";

const userModel = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        username: String,
        email: String,
        password: String,

        //connect relation 1:1 connection 1 user have 1 profile (not must)
        profile: {
            type: Types.ObjectId,
            ref: "Profile",
            //unique: true, //can not have multiple profiles (can not have 2 or more profile)
        },

        //connect 1:M relationship 1 user have many products [this side has many product]
        product:[
            {
                type:Types.ObjectId,
                ref:"Product",
            }
        ]
    },

    
    { timestamps: true }
);

const User = model("User", userModel);
export default User;

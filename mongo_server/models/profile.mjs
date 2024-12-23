import { model, Schema, Types } from "mongoose";

const profileModel = new Schema({

    image: {
        type: String,
        required: true
    },

    //connect relation 1:1 connection 1 profile must have 1 user
    user: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    }
},
    { timestamps: true }
)

const Profile = model("Profile", profileModel);
export default Profile;
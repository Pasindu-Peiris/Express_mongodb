import { model, Schema, Types } from "mongoose";

const productModule = new Schema(
    {
        title: {
            type: String
        },
        image: String,
        //connect user 1:M relationship 
        user: {
            type: Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
)

const Product = model("Product", productModule);
export default Product;
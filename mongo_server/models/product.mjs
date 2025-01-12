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
        },
        //connect N:M relationship product and category || category as ARRAY[]
        category:[
            {
                type:Types.ObjectId,
                ref:"Category"
            }
        ]
    },
    { timestamps: true }
)

const Product = model("Product", productModule);
export default Product;
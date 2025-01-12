import { model, Schema, Types } from "mongoose";

const categoryModule = new Schema(
    {
        title: String,
        //connect N:M relationship product and category || product as ARRAY[]
        product: [
            {
                type: Types.ObjectId,
                ref: "Product"
            }
        ]
    },
    { timestamps: true }

)

const Category = model("Category", categoryModule);
export default Category;
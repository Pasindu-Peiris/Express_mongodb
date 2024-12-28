import { Router } from "express";
import Product from "../models/product.mjs";
import User from "../models/user.mjs";

const productRouter = Router();

productRouter.get("/", async (_, w) => {
    return w.status(200).json({ message: "product router is working !" });
});

//get all products
productRouter.get("/product-all", async (_, w) => {
    try {
        const allProduct = await Product.find();

        if (!allProduct) {
            return w.status(400).json({ message: "products not found!" });
        }

        return w.status(200).json({ products: allProduct });
    } catch (error) {
        console.log(error);
        return w.status(500).json({ message: "internal server error!" });
    }
});

//create product [product create with user id [product cerate => add product _id into User document product array[]]]
productRouter.post("/product-create", async (c, w) => {
    const { user, title, image } = c.body;

    try {
        const created_product = await Product.create({ user, title, image }); //create product

        const update_user_product = await User.updateOne(
            //update user product array using created new product
            { _id: user },
            { $push: { product: created_product._id } },
            {
                new: true, // Return the updated profile
                runValidators: true, // Validate the fields before saving
            }
        );

        return w.status(200).json({ message: "product created with user" })

    } catch (error) {
        console.log(error);
        return w.status(500).json({ message: "internal server error!" });
    }
});

productRouter.get('/product-user/:pid', async (c, w) => {

    const { pid } = c.params;

    console.log(pid)

    try {

        const get_product = await Product.findById(pid).populate("user") //product get with user

        if(!get_product){
            return w.status(200).json({message : "product not found!" })
        }

        return w.status(200).json({product :get_product })

    } catch (error) {
        console.log(error);
        return w.status(500).json({ message: "internal server error!" });
    }

})



export default productRouter;

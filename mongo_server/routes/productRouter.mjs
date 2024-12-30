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

        if (!get_product) {
            return w.status(200).json({ message: "product not found!" })
        }

        return w.status(200).json({ product: get_product })

    } catch (error) {
        console.log(error);
        return w.status(500).json({ message: "internal server error!" });
    }

})


//delete product and disconnect user
productRouter.delete('/delete-product/:productId', async (c, w) => {

    const productId = c.params.productId;

    try {

        const deleted_product = await Product.findByIdAndDelete(productId);

        if (!deleted_product) {
            return w.status(400).json({ message: "product is not deleted!" })
        }

        const delete_product_user = await User.updateOne(
            //update user product array using delete product [disconnect product in user's product array]
            { _id: deleted_product.user },
            { $pull: { product: deleted_product._id } },
            {
                new: true, // Return the updated profile
                runValidators: true, // Validate the fields before saving
            }
        )

        if (!delete_product_user) {
            return w.status(400).json({ message: "product is not deleted!" })
        }

        return w.status(200).json({ message: "product deleted successful user disconnected", user: deleted_product, product: delete_product_user })

    } catch (error) {

        console.log(error);
        return w.status(500).json({ message: "internal server error!" });
    }

})


//update
productRouter.put('/update-product/:productId', async (c, w) => {

    const { user, title, image } = c.body;

    try {

        const productId = c.params.productId;

        const search_user_id = await Product.findById(productId); //get product details [for check user id]

        if (search_user_id.user == user) { //check if db user === coming user for update

            const disconnect_user = await User.updateOne(
                //update user product array using delete product [disconnect product in user's product array]
                { _id: search_user_id.user },
                { $pull: { product: search_user_id._id } },
                {
                    new: true, // Return the updated profile
                    runValidators: true, // Validate the fields before saving
                }
            )

            const created_product = await Product.create({ user, title, image }); //create product

            if (!created_product) {
                return w.status(400).json({ message: "product is not updated!" })
            }

            const update_user_product = await User.updateOne(
                //update user product array using created new product
                { _id: user },
                { $push: { product: created_product._id } },
                {
                    new: true, // Return the updated profile
                    runValidators: true, // Validate the fields before saving
                }
            );

            if (!update_user_product) {
                return w.status(400).json({ message: "product user is not updated!" })
            }

            return w.status(200).json({ message: "product is updated with user!" })


        } else {

            const update_product = await Product.updateOne(
                { user, title, image }
            )

            if (!update_product) {
                return w.status(400).json({ message: "product is not updated!" })
            }

            return w.status(200).json({ message: "product is updated!" })

        }

    } catch (error) {

        console.log(error);
        return w.status(500).json({ message: "internal server error!" });
    }

})



export default productRouter;

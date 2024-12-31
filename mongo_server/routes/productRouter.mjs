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


//update product
productRouter.put('/update-product/:productId', async (c, w) => {

    const { user, title, image } = c.body;

    try {

        const productId = c.params.productId; //get product id for update

        const search_user_id = await Product.findById(productId); //get product details [for check user id]

        console.log(search_user_id.user) //print searched user

        if (search_user_id.user == user) { //check if db user === coming user for update

            const update_product = await Product.updateOne( //use updateOne for update product in same user
                { user, title, image } //updateOne => return only effected row details , not updated object
            )

            if (!update_product) { // updated product 
                return w.status(400).json({ message: "product is not updated!" })
            }

            return w.status(200).json({ message: "product is updated !" }) //return message for updated product



        } else { //if updated incoming user is not same search user

            //disconnect connected user for product
            const disconnect_user = await User.findOneAndUpdate( //findOneAndUpdate => return object updated , then we can get disconnect_user details
                //update user product array using delete product [disconnect product in user's product array]
                { _id: search_user_id.user },
                { $pull: { product: productId } },
                {
                    new: true, // Return the updated profile
                    runValidators: true, // Validate the fields before saving
                }
            )

            //return checker
            if (!disconnect_user) {
                return w.status(400).json({ message: "user is not disconnected!" })
            }

            console.log(disconnect_user)//print disconnect user

            //update exiting product with new incoming user
            const update_product = await Product.findOneAndUpdate({ _id: productId }, { user, title, image }); //create product

            if (!update_product) { //return check
                return w.status(400).json({ message: "product is not updated!" })
            }

            console.log(update_product)

            const update_user_product = await User.findOneAndUpdate( //connect user with findOneAndUpdate for get updated user object details
                //update user product array using created new product
                { _id: user },
                { $push: { product: update_product._id } }, //add updated product._id in user product  
                {
                    new: true, // Return the updated profile
                    runValidators: true, // Validate the fields before saving
                }
            );

            console.log(update_user_product)

            if (!update_user_product) {//return checker
                return w.status(400).json({ message: "product user is not updated!" }) 
            }

            return w.status(200).json({ message: "product is updated with user!" }) //return checker

        }

    } catch (error) {

        console.log(error);
        return w.status(500).json({ message: "internal server error!" });
    }

})



export default productRouter;

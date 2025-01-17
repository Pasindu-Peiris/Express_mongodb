import { Router } from "express";
import Category from "../models/category.mjs";
import Product from "../models/product.mjs";

const categoryRouter = Router();

categoryRouter.get("/", async (_, w) => {
    return w.status(200).json({ message: "category router is working !" });
});

//get category
categoryRouter.get("/all-category", async (c, w) => {
    try {
        const all_category = await Category.find();

        if (!all_category) {
            return w.status(400).json({ message: "category not found!" });
        }

        return w.status(200).json({ Category: all_category });
    } catch (error) {
        console.log(error);
        return w.status(500).json({ message: "internal server error!" });
    }
});

//create category
categoryRouter.post("/create-category", async (c, w) => {

    const { title } = c.body;

    try {

        const create_category = await Category.create({ title });

        if (!create_category) {
            return w.status(400).json({ message: "category not created!" });
        }
        return w.status(200).json({ Category: create_category });

    } catch (error) {
        console.log(error);
        return w.status(500).json({ message: "internal server error!" });
    }

})


//connect N:M relationship [category and product]
categoryRouter.put('/connect-product-category/:cate_id', async (c, w) => {

    const category_id = c.params.cate_id;
    const product_id = c.query.prodid;

    if (!category_id || !product_id) {
        return w.status(400).json({ message: "must provide category_id and product_id both !" })
    }

    try {

        const product_found = await Product.findById(product_id)
        const category_found = await Category.findById(category_id);

        if (!product_found || !category_id) {
            return w.status(400).json({ message: "product or category not found !" });
        }

        product_found.category.push(category_id);//push category id to category array
        category_found.product.push(product_id);

        await product_found.save();
        await category_found.save();

        return w.status(200).json({ message: "category connected with product !" })

    } catch (error) {
        console.log(error);
        return w.status(500).json({ message: "internal server error!" });
    }


});

//remove category from product
categoryRouter.delete('/remove-cate-in-product/:prodId', async (c, w) => {

    const category_id = c.query.cate_id;
    const product_id = c.params.prodId;

    try {

        const search_product = await Product.findById(product_id);

        if (!search_product) {
            return w.status(400).json({ message: "product not found !" });
        }

        const search_category = search_product.category.indexOf(category_id) //check given category Id is in category array

        if (search_category === -1) {
            return w.status(400).json({ message: "category not found !" });
        }

        const disconnect_category = await Product.findByIdAndUpdate(
            { _id: product_id },
            { $pull: { category: category_id } },
            {
                new: true, // Return the updated profile
                runValidators: true, // Validate the fields before saving
            }
        )

        if (!disconnect_category) {
            return w.status(400).json({ message: "category not disconnected from product !" });
        }
        return w.status(200).json({ message: "category disconnected from product !" });


    } catch (error) {
        console.log(error);
        return w.status(500).json({ message: "internal server error!" });
    }


})



export default categoryRouter;

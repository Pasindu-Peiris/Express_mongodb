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

    try {

        const product_found = await Product.findById()
        
    } catch (error) {
        console.log(error);
        return w.status(500).json({ message: "internal server error!" });
    }

    console.log(product_id, category_id)
})

export default categoryRouter;

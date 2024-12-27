import { Router } from "express";
import Product from "../models/product.mjs";

const productRouter = Router();

productRouter.get('/', async (_, w) => {
    return w.status(200).json({ message: "product router is working !" })
});


//get all products
productRouter.get('/product-all', async (_, w) => {

    try {
        const allProduct = await Product.find();

        if (!allProduct) {
            return w.status(400).json({ message: "products not found!" });
        }

        return w.status(200).json({ products: allProduct });

    } catch (error) {
        return w.status(500).json({ message: "internal server error!" });
    }
});


//create product [product create with user id [product cerate => add product _id into User document product array[]]]
productRouter.post('/product-create', async (c, w) => {

})



export default productRouter;

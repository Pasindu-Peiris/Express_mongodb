import { Router } from "express";
import Category from "../models/category.mjs";

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

    const {title} = c.body;

    console.log(title);

    try {

        const create_category = 
        
    } catch (error) {
        console.log(error);
        return w.status(500).json({ message: "internal server error!" });
    }

})

export default categoryRouter;

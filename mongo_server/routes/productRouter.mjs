import { Router } from "express";

const productRouter = Router();

productRouter.get('/', async (_, w) => {
    return w.status(200).json({ message: "product router is working !" })
})



export default productRouter;

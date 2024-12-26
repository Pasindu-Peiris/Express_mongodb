import { Router } from "express";
import userRouter from "./userRoute.mjs";
import profileRouter from "./profileRouter.mjs";
import productRouter from "./productRouter.mjs";

const rootRouter = Router();

rootRouter.get('/', (_, w) => {
    return w.status(200).json({ message: " root router is running" });
})

//add routers
rootRouter.use('/user', userRouter);
rootRouter.use('/profile', profileRouter);
rootRouter.use('/product', productRouter);


export default rootRouter;
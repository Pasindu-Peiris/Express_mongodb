import { Router } from "express";
import userRouter from "./userRoute.mjs";

const rootRouter = Router();

rootRouter.get('/', (_, w) => {
    return w.status(200).json({ message: " root router is running" });
})


rootRouter.use('/user', userRouter);


export default rootRouter;
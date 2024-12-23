import { Router } from "express";
import User from "../models/user.mjs";


const userRouter = Router();

userRouter.get('/', (_, w) => {
    return w.status(200).json({ message: "User route is working" });
})

userRouter.post('/save_user', async (c, w) => {
    const data = c.body;
    console.log(data);

    try {
        const save_user = await User.create(data);

        if (save_user) {
            return w.status(200).json({ message: "User created successfully", user: save_user })
        } else {

            return w.status(200).json({ message: "Can't save user" })
        }

    } catch (error) {
        return w.status(401).json({ message: error })
    }


})

export default userRouter;
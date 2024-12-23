import { Router } from "express";
import User from "../models/user.mjs";


const userRouter = Router();

//test user path working or not
userRouter.get('/', (_, w) => {
    return w.status(200).json({ message: "User route is working" });
})

//save user into db
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

//get all users in db
userRouter.get('/get_user', async (_, w) => {

    try {
        const get_user = await User.find();

        if (get_user) {
            return w.status(200).json({ Users: get_user })
        } else {
            return w.status(200).json({ message: "Users not found" })
        }

    } catch (error) {
        return w.status(400).json({ message: error });

    }

})

//get user by id in db
userRouter.get('/get-id/:id', async (c, w) => {

    const { id } = c.params;
    console.log(id)

    try {

        const user_id = await User.findOne({ _id: id })

        if (user_id) {
            return w.status(200).json({ user: user_id })
        } else {
            return w.status(401).json({ message: "user not found" })
        }

    } catch (error) {
        return w.status(400).json({ message: error })
    }

})


//get User with profile using userid
userRouter.get('/get-user-profile/:userid', async (c, w) => {

    const userid = c.params.userid;
    try {
        const get_user = await User.findById(userid).populate(["profile"]).select(["username", "name"]) //populate for get profile using connected relation using select([can get only selected attributes])

        if (!get_user) {
            return w.status(400).json({ message: "user not found !" })
        }

        return w.status(200).json({ user: get_user })

    } catch (error) {
        return w.status(400).json({ message: error })
    }

})

export default userRouter;
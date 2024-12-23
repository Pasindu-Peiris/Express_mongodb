import { Router } from "express";
import User from "../models/user.mjs";
import Profile from "../models/profile.mjs";


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

//create profile 1:1 relationship and connect profile to user
userRouter.post('/connect-profile/:userid', async (c, w) => {

    const { userid } = c.params;
    const { image } = c.body;

    console.log(userid);

    try {
        const search_user = await User.findById(userid);

        if (!search_user) {
            return w.status(200).json({ message: "user not found!" });
        }

        const create_profile = await Profile.create({ user: userid, image });
        const connected_user = await User.findByIdAndUpdate(userid, {
            profile: create_profile._id,
        },
            {
                new: true, // Return the updated document
                runValidators: true, // Ensure validators are run
            });

        console.log(create_profile)
        console.log(connected_user)

        return w.status(200).json({ message: `${userid} user connected with profile id ${create_profile._id}`, user: connected_user, profile: create_profile })

    } catch (error) {
        return w.status(400).json({ message: error })
    }



})






export default userRouter;
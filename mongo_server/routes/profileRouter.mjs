import { Router } from "express";
import User from "../models/user.mjs";
import Profile from "../models/profile.mjs";

const profileRouter = Router();

profileRouter.get('/', (_, w) => {
    return w.status(200).json({ message: "profile router is running" })
});


//create profile 1:1 relationship and connect profile to user
profileRouter.post('/connect-profile/:userid', async (c, w) => {

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


export default profileRouter;
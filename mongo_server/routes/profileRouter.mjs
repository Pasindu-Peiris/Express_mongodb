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


//get profile using id
profileRouter.get('/get-profile/:id', async (c, w) => {

    try {

        const id = c.params.id;
        const get_profile = await Profile.findById(id);

        if (!get_profile) {
            return w.status(400).json({ message: "Profile not found !" })
        }

        return w.status(400).json({ profile: get_profile });

    } catch (error) {
        return w.status(400).json({ message: error })
    }

})


//get profile using id with user
profileRouter.get('/get-profile-user/:id', async (c, w) => {

    try {

        const id = c.params.id;
        const get_profile = await Profile.findById(id).populate("user");

        if (!get_profile) {
            return w.status(400).json({ message: "Profile not found !" })
        }

        return w.status(400).json({ profile: get_profile });

    } catch (error) {
        return w.status(400).json({ message: error })
    }

});


//update profile 
profileRouter.put('/update-profile/:id', async (c, w) => {

    const id = c.params;
    const data = c.body;

    console.log(data)

    try {

        const update_profile = User.findByIdAndUpdate(id, data, {
            new: true, // Return the updated profile
            runValidators: true, // Validate the fields before saving
        })

        if (!update_profile) {
            return w.status(401).json({ message: "profile not updated" })
        }

        return w.status(200).json({ message: "profile updated", profile: update_profile })

    } catch (error) {
        return w.status(400).json({ error: error })
    }

})



export default profileRouter;
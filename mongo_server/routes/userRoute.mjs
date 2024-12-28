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

//update user by id
userRouter.put('/update-user/:id', async (c, w) => {

    const id = c.params.id;
    // const { name, username, email, password } = c.body;
    const data = c.body;

    console.log(id, data)

    try {

        const update_user = await User.findByIdAndUpdate(id, data,
            {
                new: true, // Return the updated profile
                runValidators: true, // Validate the fields before saving
            }
        )

        if (!update_user) {
            return w.status(400).json({ message: "user update failed" })
        }

        return w.status(200).json({ message: "user updated successful!", user: update_user })

    } catch (error) {
        return w.status(400).json({ message: error })
    }

})

//user delete by id
userRouter.delete('/delete-id/:id', async (c, w) => {

    const id = c.params.id;

    console.log(id)

    try {

        const delete_user = await User.findByIdAndDelete(id, {
            new: true, // Return the updated profile
            runValidators: true, // Validate the fields before saving
        })

        if(!delete_user){
            return w.status(401).json({message : "user deleted failed!", user : delete_user})
        }

        return w.status(200).json({message : "user deleted successful!"})
        
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


//delete user with his profile using id
userRouter.delete('/delete-user-profile/:userid', async (c, w) => {

    try {
        const userid = c.params.userid;

        const search_user = await User.findById(userid);

        console.log(search_user)

        if (!search_user) {
            return w.status(400).json({ message: "user not found!" });
        }

        const search_profile = await Profile.findOne({ user: search_user.id });

        console.log(search_profile)


        if (search_profile) {

            const delete_user = await User.findByIdAndDelete(userid);
            const delete_profile = await Profile.findByIdAndDelete(search_profile._id);

            if (delete_user && delete_profile) {
                return w.status(200).json({ message: "user delete successful with profile" });
            }

        } else {
            const delete_user = await User.findByIdAndDelete(userid)

            if (delete_user) {
                return w.status(200).json({ message: "user delete successful with out profile" });
            }

        }

        return w.status(401).json({ message: "could not deleted !" })

    } catch (error) {
        return w.status(400).json({ message: "error " });

    }

})


//get user by id with all products and profile
userRouter.get('/get-user-product/:userid', async (c, w) => {

    const userid = c.params.userid;
    try {
        const get_user = await User.findById(userid).populate(["product", "profile"]) //populate for get profile & products using connected relation using select([can get only selected attributes])

        if (!get_user) {
            return w.status(400).json({ message: "user not found !" })
        }

        return w.status(200).json({ user: get_user })

    } catch (error) {
        return w.status(400).json({ message: error })
    }

})





export default userRouter;
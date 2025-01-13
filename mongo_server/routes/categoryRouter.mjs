import { Router } from "express";

const categoryRouter = Router();

categoryRouter.get('/', async (_, w) => {
    return w.status(200).json({message : "category router is working !"});
})

//create category




export default categoryRouter;
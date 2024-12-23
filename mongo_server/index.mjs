import express from "express";
import "dotenv/config";
import dbconnect from "./database/db.mjs";
import rootRouter from "./routes/rootRouter.mjs";

const app = express();

app.use(express.json());

app.use("/api/v1", rootRouter); //connect routers

// console.log(process.env.PORT);
const port = process.env.PORT || 4005;

dbconnect.then(() => {

    app.listen(port, () => {
        console.log(`Mongodb is connected on port ${port}`);
    });

    app.get("/", (_, res) => {
        return res.status(200).json({ message: " mongo server is running" });
    });
    
}).catch((err) => {
    console.log("Error connecting to the database");
});

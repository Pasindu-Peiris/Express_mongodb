import express from 'express';
import 'dotenv/config';

const app = express();

app.use(express.json());

// console.log(process.env.PORT);
const port = process.env.PORT || 4005;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

app.get('/', (_, res) => {
    return res.status(200).json({ message: " mongo server is running" });
})
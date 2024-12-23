import { connect } from "mongoose";

const dbconnect = connect(process.env.MONGO_URI)

export default dbconnect;
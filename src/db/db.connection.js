import mongoose from "mongoose";
import env from "dotenv";
env.config();


const connection = mongoose.connect(process.env.DB_URI);

export default connection;
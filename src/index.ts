import express from "express"
import mongoose, { mongo } from "mongoose";
import dotenv from 'dotenv'

dotenv.config();
const app = express();
if (process.env.MONGO_URL) {
    mongoose.connect(process.env.MONGO_URL)
    console.log("Mongo Db connected")
} else {
    console.error("Error connecting database")
}
app.get('/', (req, res) => {
    res.send("Hello")
})
app.listen(3000, () => {
    console.log("Hello, server is running on port 3000")
})

import express from "express"
import mongoose, { mongo } from "mongoose";
import dotenv from 'dotenv'
import { Slider } from "./database/model.js";
import { authenticateAdmin } from "./middleware/auth.js";

dotenv.config();
const app = express();
app.use(express.json());

async function connectDB() {

    try {
        const monogodb_url = process.env.MONGO_URL;
        if (!monogodb_url) {
            throw new Error("DB URL must be provided")
        }
        await mongoose.connect(monogodb_url);
        console.log("DB connected");

    } catch (error) {
        console.error("Error connecting with database", error);
    }
}
connectDB();

app.get('/', (req, res) => {
    res.send("Hello")
})

// Slider Admin APIs
app.post('/api/admin/sliders', authenticateAdmin, async (req, res) => {
    try {
        const slider = await Slider.create(req.body);
        res.status(201).json(slider);
    } catch (error) {
        res.status(500).json({ error: "Failed to create slider" });
    }
});

app.put('/api/admin/sliders/:id', authenticateAdmin, async (req, res) => {
    try {
        const slider = await Slider.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(slider);
    } catch (error) {
        res.status(500).json({ error: "Failed to update slider" });
    }
});

app.delete('/api/admin/sliders/:id', authenticateAdmin, async (req, res) => {
    try {
        await Slider.findByIdAndDelete(req.params.id);
        res.json({ message: "Slider deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete slider" });
    }
});

app.get('/api/sliders', async (req, res) => {
    try {
        const sliders = await Slider.find();
        res.json(sliders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch sliders" });
    }
});

app.listen(3000, () => {
    console.log("Hello, server is running on port 3000")
})

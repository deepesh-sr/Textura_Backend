import express from "express"
import mongoose, { mongo } from "mongoose";
import dotenv from 'dotenv'
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { Slider, User, Role, Blog } from "./database/model.js";
import { authenticateAdmin } from "./middleware/auth.js";

const UserTyped = User as any;
const SliderTyped = Slider as any;
const BlogTyped = Blog as any;

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Validation Schemas
const blogSchema = z.object({
    title: z.string().min(3).max(100),
    slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
    content: z.string().min(10),
    metaTitle: z.string().max(70).optional(),
    metaDescription: z.string().max(160).optional(),
    featuredImage: z.string().url().optional(),
    status: z.enum(['draft', 'published']).optional()
});

dotenv.config();
const app = express();
app.use(cors());
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

// Auth APIs
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserTyped.create({
            name,
            email,
            password: hashedPassword,
            role: role || Role.User
        });
        res.status(201).json({ message: "User created", userId: user._id });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Signup failed" });
    }
});

app.post('/api/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserTyped.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign(
            { userid: user._id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        );
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ error: "Signin failed" });
    }
});

// Slider Admin APIs
app.post('/api/admin/sliders', authenticateAdmin, async (req, res) => {
    try {
        const slider = await SliderTyped.create(req.body);
        res.status(201).json(slider);
    } catch (error) {
        res.status(500).json({ error: "Failed to create slider" });
    }
});

app.put('/api/admin/sliders/:id', authenticateAdmin, async (req, res) => {
    try {
        const slider = await SliderTyped.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        res.json(slider);
    } catch (error) {
        res.status(500).json({ error: "Failed to update slider" });
    }
});

app.delete('/api/admin/sliders/:id', authenticateAdmin, async (req, res) => {
    try {
        await SliderTyped.findByIdAndDelete(req.params.id);
        res.json({ message: "Slider deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete slider" });
    }
});

app.get('/api/sliders', async (req, res) => {
    try {
        const sliders = await SliderTyped.find();
        res.json(sliders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch sliders" });
    }
});

// Blog Admin APIs
app.post('/api/admin/blogs', authenticateAdmin, async (req, res) => {
    try {
        const body = { ...req.body };
        // If status is missing in POST, Default to draft
        if (!body.status) body.status = 'draft';
        
        const validatedData = blogSchema.parse(body);
        
        // Sanitize content against XSS
        validatedData.content = DOMPurify.sanitize(validatedData.content);

        const blog = await BlogTyped.create(validatedData);
        res.status(201).json(blog);
    } catch (error: any) {
        console.error("Blog Create Error:", error); // Check your terminal for this!
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.flatten() });
        }
        if (error.code === 11000) {
            return res.status(400).json({ error: "Slug must be unique" });
        }
        res.status(500).json({ error: "Failed to create blog post" });
    }
});

app.put('/api/admin/blogs/:id', authenticateAdmin, async (req, res) => {
    try {
        const body = { ...req.body };
        const validatedData = blogSchema.partial().parse(body);
        
        if (validatedData.content) {
            validatedData.content = DOMPurify.sanitize(validatedData.content);
        }

        const blog = await BlogTyped.findByIdAndUpdate(req.params.id, validatedData, { returnDocument: 'after' });
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.json(blog);
    } catch (error: any) {
        console.error("Blog Update Error:", error); // Check your terminal for this!
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.flatten() });
        }
        if (error.code === 11000) {
            return res.status(400).json({ error: "Slug must be unique" });
        }
        res.status(500).json({ error: "Failed to update blog post" });
    }
});

app.delete('/api/admin/blogs/:id', authenticateAdmin, async (req, res) => {
    try {
        await BlogTyped.findByIdAndDelete(req.params.id);
        res.json({ message: "Blog post deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete blog post" });
    }
});

// Public Blog APIs
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await BlogTyped.find({ status: 'published' }).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});

app.get('/api/blogs/:slug', async (req, res) => {
    try {
        const blog = await BlogTyped.findOne({ slug: req.params.slug });
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blog post" });
    }
});

app.listen(3000, () => {
    console.log("Hello, server is running on port 3000")
})

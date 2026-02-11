import mongoose, { Schema, model, Types } from 'mongoose';

mongoose.Promise = global.Promise;

interface User {
  _id: Types.ObjectId,
  name: string,
  email: string,
  password: string,
  role: "Admin" | "User"
}

export enum Role {
  Teacher = "Admin",
  User = "User"
}

export enum Blogstatus {
    Draft = "draft",
    Published = "published"
}

const UserSchema = new Schema<User>({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: Object.values(Role),
    required: true
  }
})

const SliderSchema = new Schema({
    title: String,
    badge: String,
    description: String,
    buttonText: String,
    imageUrl: String,
    label: String
}, { timestamps: true })

const BlogSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: String,
  metaTitle: String,
  metaDescription: String,
  featuredImage: String,
  status: {
    type: String,
    enum: Object.values(Blogstatus),
    default: Blogstatus.Draft
  }
}, { timestamps: true })

export const User = mongoose.models.User || model<User>('User', UserSchema)
export const Slider = mongoose.models.Slider || model('Slider', SliderSchema)
export const Blog = mongoose.models.Blog || model('Blog', BlogSchema)
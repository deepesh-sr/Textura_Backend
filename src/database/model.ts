import mongoose, { Schema, model, connect, Types } from 'mongoose';

mongoose.Promise = global.Promise;

interface User {
  _id: Types.ObjectId,
  name: String,
  email: String,
  password: String, // hashed with bcrypt
  role: "Admin" | "User"
}

//enum for role
export enum Role {
  Teacher = "Admin",
  User = "User"
}

export enum Status {
  Present = "present",
  Absent = "absent"
}

export enum Blogstatus {
    Draft = "draft",
    Published = "published"
}

const UserSchema = new Schema<User>({
  // _id: Schema.Types.ObjectId,
  name: String,
  email: String,
  password: String, // hashed with bcrypt
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
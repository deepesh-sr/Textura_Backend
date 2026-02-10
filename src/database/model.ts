import mongoose, { Schema, model, connect, Types } from 'mongoose';

mongoose.Promise = global.Promise;

interface User {
  _id: Types.ObjectId,
  name: String,
  email: String,
  password: String, // hashed with bcrypt
  role: "teacher" | "student"
}

//enum for role
export enum Role {
  Teacher = "Admin",
  Student = "User"
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
  title: String,
  slug: String,            // UNIQUE
  content: String,         // Markdown or HTML
  metaTitle: String,
  metaDescription: String,
  featuredImage: String,
  status: {
    type: String,
    enum: Object.values(Blogstatus),
  },
  createdAt: Date,
  updatedAt: Date
})

export const User = mongoose.models.User || model<User>('User', UserSchema)
export const Slider = mongoose.models.Slider || model('Slider', SliderSchema)
export const Blog = mongoose.models.Blog || model('Blog', BlogSchema)
import { Schema, model, Types } from "mongoose";

export interface IPost {
  _id?: Types.ObjectId;
  author: Types.ObjectId;
  content?: string;
  image?: string;
  likes: Types.ObjectId[];
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      maxlength: 1000,
    },
    image: String,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Post = model<IPost>("Post", postSchema);

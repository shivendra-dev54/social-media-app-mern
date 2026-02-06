import express from "express";
import cors from "cors";
import dbConnect from "./db/dbConnect";
import cookieParser from "cookie-parser";
import { authRouter } from "./Routes/auth.route";
import { postRouter } from "./Routes/post.route";
import { commentRouter } from "./Routes/comment.route";

const app = express();

dbConnect();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use(authRouter);
app.use(postRouter);
app.use(commentRouter);

export default app;
import express from "express";
import cors from "cors";
import dbConnect from "./db/dbConnect.js";
import cookieParser from "cookie-parser";
import { authRouter } from "./Routes/auth.route.js";
import { postRouter } from "./Routes/post.route.js";
import { commentRouter } from "./Routes/comment.route.js";

const app = express();

dbConnect();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json(), authRouter);
app.use(postRouter);
app.use(express.json(), commentRouter);

export default app;
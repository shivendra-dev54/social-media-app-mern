import express from "express";
import cors from "cors";
import dbConnect from "./db/dbConnect";
import cookieParser from "cookie-parser";
import { authRouter } from "./Routes/auth.route";
import { postRouter } from "./Routes/post.route";
import { commentRouter } from "./Routes/comment.route";

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
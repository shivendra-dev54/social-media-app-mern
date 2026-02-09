import express from "express";
import cors from "cors";
import dbConnect from "./db/dbConnect.js";
import cookieParser from "cookie-parser";
import { authRouter } from "./Routes/auth.route.js";
import { postRouter } from "./Routes/post.route.js";
import { commentRouter } from "./Routes/comment.route.js";
import { ApiResponse } from "./utils/ApiResponse.js";

const app = express();

dbConnect();

const corsOptions: cors.CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin) return callback(null, true);

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (origin === allowedOrigin) return true;

      if (
        allowedOrigin.endsWith('.vercel.app') &&
        origin.endsWith('.vercel.app')
      ) {
        return true;
      }

      if (allowedOrigin.includes('*')) {
        const pattern = allowedOrigin.replace(/\*/g, '.*');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(origin);
      }

      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log(`Blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie'],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use(authRouter);
app.use(postRouter);
app.use(commentRouter);

// Health
app.get('/health', (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, "server is running...", true, null).toString()
  );
});

export default app;
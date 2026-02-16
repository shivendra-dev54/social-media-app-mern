import { Router } from "express";
import { getHealth } from "../Controllers/health.controller.js";

const healthRouter = Router();

healthRouter.route("/api/health").get(getHealth);

export {
  healthRouter
};
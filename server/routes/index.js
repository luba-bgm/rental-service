import { Router } from "express";
import offerRouter from "./offerRoutes.js";

const router = new Router();

router.use("/", offerRouter);

export { router };
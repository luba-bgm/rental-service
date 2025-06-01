import { Router } from "express";
import offerRouter from "./offerRoutes.js";
import userRoutes from "./userRoutes.js";
import reviewRouter from "./reviewRoutes.js";

const router = new Router();

router.use("/", offerRouter);
router.use("/", userRoutes);
router.use("/comments", reviewRouter);

export { router };
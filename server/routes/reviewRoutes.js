import Router from "express";
import {
  addReview,
  getReviewsByOfferId,
} from "../controllers/reviewController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = new Router();

router.post("/:offerId", addReview);
router.get("/:offerId", authenticateToken, getReviewsByOfferId);

export default router;
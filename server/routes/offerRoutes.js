import { Router } from "express";
import upload from "../middleware/upload.js";
import {
  createOffer,
  getAllOffers,
  getFavoriteOffers,
  getFullOffer,
  toggleFavorite,
} from "../controllers/offerController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const offerRouter = new Router();

offerRouter.get("/offers/favorite", getFavoriteOffers);
offerRouter.post(
  "/favorite/:offerId/:status",
  authenticateToken,
  toggleFavorite
);
offerRouter.get("/offers/:id", getFullOffer);
offerRouter.get("/offers", getAllOffers);
offerRouter.post(
  "/offers",
  upload.fields([
    { name: "previewImage", maxCount: 1 },
    { name: "photos", maxCount: 6 },
  ]),
  createOffer
);

export default offerRouter;
import { Router } from "express";
import { getAllOffers } from "../controllers/offerController.js";

const offerRouter = new Router();

offerRouter.get("/offers", getAllOffers);

export default offerRouter;
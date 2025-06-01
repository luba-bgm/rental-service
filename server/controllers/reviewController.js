import { adaptReviewToClient } from "../adapters/reviewAdapter.js";
import ApiError from "../error/apiError.js";
import { Review } from "../models/review.js";
import { User } from "../models/user.js";

const addReview = async (res, req, next) => {
  try {
    const { comment, rating } = req.body;
    const offerId = req.params.offerId;
    const userId = req.user.id;

    if (!comment || !rating || !offerId) {
      return next(ApiError.badRequest("Не хвататет данных для комментария!"));
    }

    const review = await Review.create({
      text: comment,
      rating,
      authorId: userId,
      OfferId: offerId,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    next(ApiError.badRequest("Ошибка при добавлении коммаентария!"));
  }
};

const getReviewsByOfferId = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { OfferId: req.params.offerId },
      include: { model: User, as: "author" },
      order: [["publishDate", "DESC"]],
    });

    const adaptedReviews = reviews.map(adaptReviewToClient);
    res.json(adaptedReviews);
  } catch (err) {
    console.error(err);
    next(ApiError.badRequest("Ошибка при получении комментариев!"));
  }
};

export { addReview, getReviewsByOfferId };
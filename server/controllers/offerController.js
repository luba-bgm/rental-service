import { Offer } from "../models/offer.js";
import { User } from "../models/user.js";
import ApiError from "../error/apiError.js";
import {
  adaptOfferToClient,
  adaptFullOfferToClient,
} from "../adapters/offerAdapter.js";

async function getFullOffer(req, res, next) {
  try {
    const { id } = req.params;

    const offer = await Offer.findByPk(id, {
      include: {
        model: User,
        as: "author",
      },
    });

    if (!offer) {
      return next(ApiError.badRequest("Offer not found"));
    }

    const adaptedOffers = adaptFullOfferToClient(offer);

    res.send(adaptedOffers);
  } catch (err) {
    console.error("No full order: ", err);
  }
}

async function getAllOffers(req, res, next) {
  try {
    const offers = await Offer.findAll();
    const adaptedOffers = offers.map(adaptOfferToClient);
    res.status(200).json(adaptedOffers);
  } catch (err) {
    console.error("No offers: ", err);
  }
}

export async function createOffer(req, res, next) {
  try {
    const {
      title,
      description,
      publishDate,
      city,
      isPremium,
      isFavorite,
      rating,
      type,
      rooms,
      guests,
      price,
      features,
      commentsCount,
      latitude,
      longitude,
      userId,
    } = req.body;

    if (!req.files?.previewImage || req.files.previewImage === 0) {
      return next(
        ApiError.badRequest("Preview image is required for downloading")
      );
    }

    const previewImagePath = `/static/${req.files.previewImage[0].filename}`;

    let processedPhotos = [];

    if (req.files?.photos) {
      processedPhotos = req.files.photos.map(
        (file) => `/static/${file.filename}`
      );
    }

    let parsedFeatures = [];
    if (features) {
      try {
        parsedFeatures =
          typeof features === "string" ? JSON.parse(features) : features;
      } catch {
        parsedFeatures = features.split(",");
      }
    }

    const offer = await Offer.create({
      title,
      description,
      publishDate,
      city,
      previewImage: previewImagePath,
      photos: processedPhotos,
      isPremium,
      isFavorite,
      rating,
      type,
      rooms,
      guests,
      price,
      features: parsedFeatures,
      commentsCount,
      latitude,
      longitude,
      authorId: userId,
    });

    return res.status(201).json(offer);
  } catch (error) {
    next(ApiError.internal("Failed to add a order: " + error.message));
  }
}

const getFavoriteOffers = async (req, res, next) => {
  try {
    const favoriteOffers = await Offer.findOne({ where: { isFavorite: true } });
    console.log(2);
    res.json(favoriteOffers);
  } catch (err) {
    console.error(err);
    next(
      ApiError.badRequest("Не удалось получить список всех избранных офферов")
    );
  }
};

const toggleFavorite = async (req, res, next) => {
  try {
    const { offerId, status } = req.params;

    const offer = await Offer.findByPk(offerId);
    if (!offer) {
      return next(ApiError.notFound("Предложение не найдено"));
    }

    offer.isFavorite = status === "1";
    await offer.save();

    res.json(offer);
  } catch (err) {
    console.error(err);
    next(ApiError.badRequest("Ошибка при обновлении статуса избранного!"));
  }
};

export { getAllOffers, getFullOffer, getFavoriteOffers, toggleFavorite };
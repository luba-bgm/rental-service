import Router from 'express';
import {authenticateToken} from '../middleware/authMiddleware.js';
import {addReview, getReviewsByOfferId} from '../controllers/reviewController.js';

const router = new Router();

router.post('/:offerId', addReview);
router.get('/:offerId',authenticateToken, getReviewsByOfferId);


export default router;
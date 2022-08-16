const { Router } = require('express');
const { Review } = require('../models/Review');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = Router();

const authorizeReviewOwnership = authorize(async (req) => {
    return await Review.getById(req.params.id);
});

router.delete('/:id', [authenticate, authorizeReviewOwnership], async (req, res, next) => {
    try {
        const review = await Review.delete(req.params.id);
        res.json(review);
    } catch (error) {
        next(error);
    }
});

module.exports = router;

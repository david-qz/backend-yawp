const { Router } = require('express');
const { Restaurant } = require('../models/Restaurant');
const { Review } = require('../models/Review');
const authenticate = require('../middleware/authenticate');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const restaurants = await Restaurant.getAll();
        res.json(restaurants);
    } catch (error) {
        next(error);
    }
});

router.get('/search', async (req, res, next) => {
    try {
        const restaurants = await Restaurant.search(req.query.query);
        res.json(restaurants);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const restaurant = await Restaurant.getById(req.params.id);
        res.json(restaurant);
    } catch (error) {
        next(error);
    }
});

router.post('/:id/reviews', authenticate, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const restaurantId = req.params.id;

        const review = await Review.insert({ userId, restaurantId, ...req.body });
        res.json(review);
    } catch (error) {
        next(error);
    }
});

module.exports = router;

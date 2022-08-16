const { Router } = require('express');
const { Restaurant } = require('../models/Restaurant');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const restaurants = await Restaurant.getAll();
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

module.exports = router;

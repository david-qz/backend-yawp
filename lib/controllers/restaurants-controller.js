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

module.exports = router;

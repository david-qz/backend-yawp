const { Router } = require('express');
const { User } = require('../models/User');
const { UserService } = require('../services/UserService');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const ONE_DAY_IN_MS = 3600 * 24 * 1000;

const router = Router();

router.post('/', async (req, res, next) => {
    try {
        // Create a new user, throws if email is already in use.
        const user = await UserService.create(req.body);
        // Sign them in using same credentials they just signed up with.
        const token = await UserService.signIn(req.body); // Hopefully this never throws...

        // Set session cookie in response.
        res.cookie(process.env.COOKIE_NAME, token, {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MS
        });

        res.json(user); // Return user.
    } catch (error) {
        next(error);
    }
});

router.get('/', [authenticate, authorize], async (req, res, next) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (error) {
        next(error);
    }
});

router.post('/sessions', async (req, res, next) => {
    try {
        // Sign the user in...
        const token = await UserService.signIn(req.body);

        // Set session cookie in response.
        res.cookie(process.env.COOKIE_NAME, token, {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MS
        });

        res.send(); // Send empty 200
    } catch (error) {
        next(error);
    }
});

router.delete('/sessions', async (req, res) => {
    // Clear the cookie. This action should be idempotent, so we don't need to check if there's a session to start with.
    res.clearCookie(process.env.COOKIE_NAME, {
        httpOnly: true
    });
    res.send();
});

module.exports = router;

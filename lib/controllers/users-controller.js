const { Router } = require('express');
const { UserService } = require('../services/UserService');

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

module.exports = router;

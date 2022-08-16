const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const cookie = req.cookies?.[process.env.COOKIE_NAME];
        req.user = jwt.verify(cookie, process.env.JWT_SECRET);
        next();
    } catch (error) {
        next(error);
    }
};

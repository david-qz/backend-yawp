const jwt = require('jsonwebtoken');
const HttpError = require('../utils/HttpError');

module.exports = async (req, res, next) => {
    try {
        const cookie = req.cookies?.[process.env.COOKIE_NAME];
        req.user = jwt.verify(cookie, process.env.JWT_SECRET);
        next();
    } catch (error) {
        next(new HttpError('unauthorized', 401));
    }
};

const HttpError = require('../utils/HttpError');

module.exports = async (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        next(new HttpError('unauthorized', 401));
    }
};

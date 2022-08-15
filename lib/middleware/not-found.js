const HttpError = require('../utils/HttpError');

module.exports = (req, res, next) => {
    next(new HttpError('not found', 404));
};

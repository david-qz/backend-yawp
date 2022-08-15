const HttpError = require('../utils/HttpError');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
    const status = err.status || 500;

    res.status(status);

    // During testing only log non-http errors
    if (process.env.NODE_ENV !== 'test' || !(err instanceof HttpError)) {
        // eslint-disable-next-line no-console
        console.log(err);
    }

    res.send({
        status,
        message: err.message,
    });
};

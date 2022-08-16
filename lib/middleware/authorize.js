const HttpError = require('../utils/HttpError');

module.exports = resourceSupplier => {
    return async (req, res, next) => {
        if (req.user.isAdmin) {
            next();
            return;
        }

        if (resourceSupplier) {
            const resource = await resourceSupplier(req);
            if (resource.userId === req.user.id) {
                req.resource = resource;
                next();
                return;
            }
        }

        next(new HttpError('unauthorized', 401));
    };
};

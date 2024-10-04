const authService = require('../services/auth');
const userService = require('../services/user');

exports.authenticate = async (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).send('Authentication token not provided');
    }

    const id = await authService.verify(req.headers.authorization);

    if (!id) {
        res.status(401).send('Bad token');
    }

    req.token = req.headers.authorization;
    req.googleId = id;
    req.user = await userService.getUserById({ id });

    next();
};
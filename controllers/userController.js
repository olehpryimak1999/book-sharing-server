const userService = require('../services/user');
const authService = require("../services/auth");

exports.info = async (req, res) => {
    let curUser = req.user;

    if (!curUser) {
        const userInfo = await authService.getUserInfo(req.token);
        await userService.createUser(userInfo);
        curUser = await userService.getUserById({ id: req.googleId });
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true, ...curUser }));
}
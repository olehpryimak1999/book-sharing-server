const userService = require('../services/user');
const authService = require("../services/auth");
const fileService = require("../services/files");

exports.info = async (req, res) => {
    let curUser = req.user;

    if (!curUser) {
        const userInfo = await authService.getUserInfo(req.token);
        const pictureBuffer = await fileService.downloadFileByUrl({ url: userInfo.picture });
        const picture = await fileService.uploadPhotoFromBuffer({ bucketName: 'books-storage-images', name: `profile-${req.googleId}`, file: pictureBuffer });

        await userService.createUser({ ...userInfo, picture });
        curUser = await userService.getUserById({ id: req.googleId });
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true, ...curUser }));
}

exports.update = async (req, res) => {
    await userService.updateUser({ ...req.body, id: req.user.user_id });

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
}

exports.updatePhoto = async (req, res) => {
    await fileService.uploadPhotoFromBuffer({ bucketName: 'books-storage-images', name: `profile-${req.googleId}`, file: req.file.buffer });

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
}
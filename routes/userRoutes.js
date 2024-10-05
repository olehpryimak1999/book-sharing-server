const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({
    storage: multer.memoryStorage(),
});


const userController = require('../controllers/userController');

router.get(`/info`, userController.info);
router.patch('/info', userController.update);
router.post('/info/photo', upload.single('file'), userController.updatePhoto);

module.exports = router;
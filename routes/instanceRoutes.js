const express = require('express');
const multer = require("multer");
const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
});

const instanceController = require("../controllers/instanceController");

router.get(`/my`, instanceController.my);
router.post('/my', upload.single('file'), instanceController.create);
router.delete('/my/:id', instanceController.delete);
router.get('/exchange/list', instanceController.getBooksToExchange);
router.get('/exchange/:id', instanceController.getBookById);

module.exports = router;
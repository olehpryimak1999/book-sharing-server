const express = require('express');
const bookController = require("../controllers/bookController");
const multer = require("multer");
const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
});

router.get(`/all`, bookController.books)
router.get(`/my`, bookController.my);
router.post('/my', upload.single('file'), bookController.create)
router.delete('/my/:id', bookController.delete)

module.exports = router;
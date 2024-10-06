const express = require('express');
const router = express.Router();

const bookController = require("../controllers/bookController");

router.get(`/all`, bookController.books);

module.exports = router;
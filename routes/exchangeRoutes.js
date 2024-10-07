const express = require('express');
const router = express.Router();

const exchangeController = require("../controllers/exchangeController");

router.post(`/create`, exchangeController.create);

module.exports = router;
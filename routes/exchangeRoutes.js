const express = require('express');
const router = express.Router();

const exchangeController = require("../controllers/exchangeController");

router.get(`/get`, exchangeController.get);
router.post(`/create`, exchangeController.create);
router.patch('/:id', exchangeController.update);

module.exports = router;
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get(`/info`, userController.info);
router.patch('/info', userController.update);

module.exports = router;
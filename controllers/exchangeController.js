const instanceService = require('../services/instance');
const exchangeService = require('../services/exchange');

exports.create = async (req, res) => {
    const bookInstance = await instanceService.getBookById({ id: req.body.book });
    const exchangeInstance = await exchangeService.create({ user1: bookInstance.user_id, user2: req.user.user_id, book: req.body.book });

    res.status(201).send();
}
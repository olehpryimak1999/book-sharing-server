const instanceService = require('../services/instance');
const exchangeService = require('../services/exchange');

exports.create = async (req, res) => {
    const bookInstance = await instanceService.getBookById({ id: req.body.book });
    const exchangeInstance = await exchangeService.create({ user1: bookInstance.user_id, user2: req.user.user_id, book: req.body.book });

    res.status(201).send();
}

exports.get = async (req, res) => {
    const other = await exchangeService.get({ user: req.user.user_id, status: req.query.status });
    const my = await exchangeService.getMy({ user: req.user.user_id, status: req.query.status });

    res.status(200).send({ other, my });
}

exports.update = async (req, res) => {
    const affectedId = await exchangeService.update({ id: req.params.id, status: req.body.status })

    res.status(200).send(!!affectedId);
}
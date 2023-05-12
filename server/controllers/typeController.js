const {type} = require('../db/models')

async function create(req, res, next) {
    try {
        const {name} = req.body
        const typeElem = await type.create({name})
        res.json(typeElem);
    }
    catch (err) {
        next(new Error(err.message))
    }
}

async function getAll(req, res) {
    const types = await type.findAll()
    res.json(types)
}

module.exports = {
  create,
  getAll
};

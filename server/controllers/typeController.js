const {type} = require('../db/models')
const apiError = require('../error/apiError')

async function create(req, res) {
    try {
        const {name} = req.body
        const typeElem = await type.create({name})
        res.json(typeElem);
    }
    catch (err) {
        console.log(err)
        res.json({message: "bad"});
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

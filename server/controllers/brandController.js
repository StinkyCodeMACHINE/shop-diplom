const { brand } = require("../db/models");

async function create(req, res, next) {
  try {
    const { name, img } = req.body;
    const brandElem = await brand.create({ name, img });
    res.json(brandElem);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getAll(req, res) {
  const brands = await brand.findAll();
  res.json(brands);
}

module.exports = {
  create,
  getAll,
};

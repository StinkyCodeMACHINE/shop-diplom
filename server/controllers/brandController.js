const { brand } = require("../db/models");

async function create(req, res) {
  try {
    const { name } = req.body;
    const brandElem = await brand.create({ name });
    res.json(brandElem);
  } catch (err) {
    console.log(err);
    res.json({ message: "bad" });
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

const { brand } = require("../db/models");
const uuid = require("uuid");
const path = require("path");

async function create(req, res, next) {
  try {
    const { name} = req.body;
    const { img } = req.files;
    let fileName = uuid.v4() + ".png";
    img.mv(path.resolve(__dirname, "..", "static", "brand-images", fileName));
    const brandElem = await brand.create({ name, img: fileName });
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

const { type } = require("../db/models");
const uuid = require("uuid");
const path = require("path");

async function create(req, res, next) {
  try {
    const { name, groupId } = req.body;
    const { img } = req.files;
    let fileName = uuid.v4() + ".jpg";
    img.mv(path.resolve(__dirname, "..", "static", "type-images", fileName));
    
    const typeElem = await type.create({ name, img: fileName });
    res.json(typeElem);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getAll(req, res) {
  const types = await type.findAll();
  res.json(types);
}

module.exports = {
  create,
  getAll,
};

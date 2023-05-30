const { group } = require("../db/models");
const uuid = require("uuid");
const path = require("path");

async function create(req, res, next) {
  try {
    const { name } = req.body;
    const { img } = req.files;
    let fileName = uuid.v4() + ".png";
    img.mv(path.resolve(__dirname, "..", "static", "group-images", fileName));

    const groupElem = await group.create({ name, img: fileName });
    res.json(groupElem);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getAll(req, res) {
  const groups = await group.findAll({
    order: [['name', 'DESC']]
  });
  res.json(groups);
}

module.exports = {
  create,
  getAll,
};

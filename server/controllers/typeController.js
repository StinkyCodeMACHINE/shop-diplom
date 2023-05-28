const { type, defaultTypeInfo } = require("../db/models");
const uuid = require("uuid");
const path = require("path");

async function create(req, res, next) {
  try {
    let { name, groupId, info } = req.body;
    const { img } = req.files;
    let fileName = uuid.v4() + ".jpg";
    img.mv(path.resolve(__dirname, "..", "static", "type-images", fileName));

    const typeElem = await type.create({ name, img: fileName, groupId });

    if (info) {
      info = JSON.parse(info);
      info.forEach((element) => {
        defaultTypeInfo.create({
          key: element.key,
          typeId: typeElem.id,
        });
      });
    }

    res.json(typeElem);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getAll(req, res) {
  const types = await type.findAll({
    order: [["name", "DESC"]],
  });
  res.json(types);
}

async function getInfo(req, res) {
  const { id } = req.params;
  const info = await defaultTypeInfo.findAll({
    where: {
      typeId: id,
    },
  });
  res.json(info);
}

module.exports = {
  create,
  getAll,
  getInfo,
};

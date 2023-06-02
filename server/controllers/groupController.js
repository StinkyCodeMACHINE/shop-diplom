const { group } = require("../db/models");
const uuid = require("uuid");
const path = require("path");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");

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
  let { limit, page, name } = req.query;
  let offset = page * limit - limit;
  name = name ? name : "";
  const additionalConditions =
    limit && page
      ? {
          limit,
          offset,
          where: {
            name: { [Op.iLike]: `%${name}%` },
          },
          order: [["id", "ASC"]],
        }
      : {};

  const groups = await group.findAndCountAll({
    order: [["name", "DESC"]],
    ...additionalConditions,
  });
  res.json(groups);
}

async function deleteGroup(req, res, next) {
  try {
    const { id } = req.params;
    const result = await group.destroy({
      where: {
        id,
      },
    });
    res.json(result);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function changeGroup(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const img = req.files && req.files.img;
    let fileName = uuid.v4() + ".png";
    if (img) {
      img.mv(path.resolve(__dirname, "..", "static", "group-images", fileName));
    }

    const result = await group.update(
      {
        name,
        img: img ? fileName : Sequelize.literal('"img"'),
      },
      {
        where: {
          id,
        },
      }
    );
    res.json(result);
  } catch (err) {
    next(new Error(err.message));
  }
}

module.exports = {
  create,
  getAll,
  deleteGroup,
  changeGroup,
};

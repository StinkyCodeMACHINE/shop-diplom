const { brand } = require("../db/models");
const uuid = require("uuid");
const path = require("path");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");

async function create(req, res, next) {
  try {
    const { name } = req.body;
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

  const brands = await brand.findAndCountAll({
    order: [["name", "DESC"]],
    ...additionalConditions,
  });

  res.json(brands);
}

async function deleteBrand(req, res, next) {
  try {
    const { id } = req.params;
    const result = await brand.destroy({
      where: {
        id,
      },
    });
    res.json(result);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function changeBrand(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const img = req.files && req.files.img;
    let fileName = uuid.v4() + ".png";
    if (img) {
      img.mv(path.resolve(__dirname, "..", "static", "brand-images", fileName));
    }

    const result = await brand.update(
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
  changeBrand,
  deleteBrand,
};

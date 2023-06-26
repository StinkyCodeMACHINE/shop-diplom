const { type, defaultTypeInfo } = require("../db/models");
const uuid = require("uuid");
const path = require("path");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");

async function create(req, res, next) {
  try {
    let { name, groupId, info } = req.body;
    const { img } = req.files;
    let fileName = uuid.v4() + ".png";
    img.mv(path.resolve(__dirname, "..", "static", "type-images", fileName));

    const typeElem = await type.create({ name, img: fileName, groupId });

    if (info) {
      info = JSON.parse(info);
      info.forEach((element) => {
        defaultTypeInfo.create({
          key: element.key.charAt(0).toUpperCase() +
                    element.key.slice(1),
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

  const types = await type.findAndCountAll({
    order: [["name", "ASC"]],
    ...additionalConditions,
  });
  res.json(types);
}

async function getInfo(req, res) {
  const { id } = req.params;
  const info = await defaultTypeInfo.findAll({
    where: {
      typeId: Number(id),
    },
  });
  res.json(info);
}

async function deleteType(req, res, next) {
  try {
    const { id } = req.params;
    const result = await type.destroy({
      where: {
        id,
      },
    });
    res.json(result);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function changeType(req, res, next) {
  try {
    const { id } = req.params;
    let { name, groupId, info } = req.body;
    const img = req.files && req.files.img;
    let fileName = uuid.v4() + ".png";
    if (img) {
      img.mv(path.resolve(__dirname, "..", "static", "type-images", fileName));
    }

    const result = await type.update(
      {
        name,
        img: img ? fileName : Sequelize.literal('"img"'),
        groupId,
      },
      {
        where: {
          id,
        },
      }
    );
    const prevInfo = await defaultTypeInfo.findAll({
      where: {
        typeId: id,
      },
    });

    if (info) {
      info = JSON.parse(info);
      prevInfo.forEach((prevInfoElem) => {
        if (!info.find((infoElem) => infoElem.key === prevInfoElem.key)) {
          defaultTypeInfo.destroy({
            where: {
              id: prevInfoElem.id,
            },
          });
        } else {
          info = info.filter((elem) => elem.key !== prevInfoElem.key);
        }
      });

      info.forEach((element) => {
        defaultTypeInfo.create({
          key: element.key.charAt(0).toUpperCase() +
                    element.key.slice(1),
          typeId: id,
        });
      });
    }

    res.json(result);
  } catch (err) {
    next(new Error(err.message));
  }
}

module.exports = {
  create,
  getAll,
  getInfo,
  deleteType,
  changeType,
};

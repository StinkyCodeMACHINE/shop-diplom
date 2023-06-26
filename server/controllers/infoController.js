const { productInfo, product } = require("../db/models");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");

async function getInstances(req, res) {
  let { typeId, key } = req.query;
  typeId = Number(typeId)
  const info = await productInfo.findAll({
    attributes: [
      "value",
      [Sequelize.fn("COUNT", Sequelize.col("value")), "count"],
      "typeId",
    ],
    where: {
      key,
      typeId,
    },
    group: ["value", "typeId"],
    order: [["count", "DESC"]],
  });
  res.json(info);
}

module.exports = {
  getInstances,
};

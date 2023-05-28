const { productInfo } = require("../db/models");
const { Sequelize } = require("sequelize");

async function getInstances(req, res) {
  const { keyId } = req.params;
  const info = await productInfo.findAll({
    attributes: [
      "value",
      [Sequelize.fn("COUNT", Sequelize.col("value")), "count"],
      "typeDefaultInfoId",
    ],
    where: {
      typeDefaultInfoId: keyId,
    },
    group: ["value", "typeDefaultInfoId"],
    order: [["count", "DESC"]],
  });
  res.json(info);
}

module.exports = {
  getInstances,
};

const uuid = require("uuid"); // генерирует случайные id
const path = require("path");
const { product, productInfo } = require("../db/models");

async function create(req, res, next) {
  try {
    let { name, price, brandId, typeId, info } = req.body;
    const { img } = req.files;
    let fileName = uuid.v4() + ".jpg";
    img.mv(path.resolve(__dirname, "..", "static", "product-images", fileName));

    const productElem = await product.create({
      name,
      price,
      brandId,
      typeId,
      info,
      img: fileName,
    });

    if (info) {
      info = JSON.parse(info);
      info.forEach((element) => {
        productInfo.create({
          title: element.title,
          description: element.description,
          productId: productElem.id,
        });
      });
    }

    res.json(productElem);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getAll(req, res) {
  let { brandId, typeId, limit, page } = req.query;
  page = page || 1;
  limit = Number(limit) || 9;
  let offset = page * limit - limit;
  let products;
  if (!brandId && !typeId) {
    products = await product.findAndCountAll({
      limit,
      offset,
    });
  } else if (brandId && !typeId) {
    products = await product.findAndCountAll({
      where: { brandId },
      limit,
      offset,
    });
  } else if (!brandId && typeId) {
    products = await product.findAndCountAll({
      where: { typeId },
      limit,
      offset,
    });
  } else {
    products = await product.findAndCountAll({
      where: { typeId, brandId },
      limit,
      offset
    });
  }
  res.json(products);
}

async function getOne(req, res) {
  const { id } = req.params;
  const productElem = await product.findOne({
    where: { id },
    include: {
      model: productInfo,
      as: "info",
    },
  });
  res.json(productElem);
}

module.exports = {
  create,
  getAll,
  getOne,
};


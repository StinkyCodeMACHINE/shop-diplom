const uuid = require("uuid"); // генерирует случайные id
const path = require("path");
const { product, productInfo, favourite } = require("../db/models");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");

async function create(req, res, next) {
  try {
    // let { name, price, brandId, typeId, info } = req.body;
    // const { img } = req.files;
    // let fileName = uuid.v4() + ".jpg";
    // img.mv(path.resolve(__dirname, "..", "static", "product-images", fileName)); было

    let { name, price, brandId, typeId, info } = req.body;
    const { img } = req.files;
    console.log(img);
    const fileNames = [];
    if (Array.isArray(img)) {
      for (let i = 0; i < img.length; i++) {
        fileNames.push(uuid.v4() + ".jpg");
        img[i].mv(
          path.resolve(
            __dirname,
            "..",
            "static",
            "product-images",
            fileNames[i]
          )
        );
      }
    } else {
      fileNames.push(uuid.v4() + ".jpg");
      img.mv(
        path.resolve(__dirname, "..", "static", "product-images", fileNames[0])
      );
    }

    console.log(fileNames);

    const productElem = await product.create({
      name,
      price,
      brandId,
      typeId,
      img: fileNames,
    });

    console.log(info);
    JSON.parse(info).forEach((element) => {
      console.log(`key: ${element.key}, value: ${element.value}`);
    });

    if (info) {
      info = JSON.parse(info);
      info.forEach((element) => {
        productInfo.create({
          key: element.key,
          value: element.value,
          productId: productElem.id,
        });
      });
    }

    res.json(productElem);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getAll(req, res, next) {
  try {
    let { brandId, typeId, limit, page, name, sorting } = req.query;
    page = page || 1;
    name = name || "";
    limit = Number(limit) || 9;
    const order = sorting &&
      sorting.byWhat && [[sorting.byWhat, sorting.order]];
    let offset = page * limit - limit;
    let products;

    if (!brandId && !typeId) {
      products = await product.findAndCountAll({
        where: { name: { [Op.like]: `%${name}%` } },
        limit,
        offset,
        // attributes: [
        //   'id', 'name', 'price', 'newPrice', 'rating', 'img', 'brandId', 'typeId', [Sequelize.literal('price/"newPrice"'), 'discount']
        // ],
        attributes: {
          include: [[Sequelize.literal('price/"newPrice"'), 'discount']],
        },
        order,
      });
    } else if (brandId && !typeId) {
      products = await product.findAndCountAll({
        where: { brandId, name: { [Op.like]: `%${name}%` } },
        limit,
        offset,
        // attributes: [
        //   'id', 'name', 'price', 'newPrice', 'rating', 'img', 'brandId', 'typeId', [Sequelize.literal('price/"newPrice"'), 'discount']
        // ],
        attributes: {
          include: [[Sequelize.literal('price/"newPrice"'), 'discount']],
        },
        order,
      });
    } else if (!brandId && typeId) {
      products = await product.findAndCountAll({
        where: { typeId, name: { [Op.like]: `%${name}%` } },
        limit,
        offset,
        // attributes: [
        //   'id', 'name', 'price', 'newPrice', 'rating', 'img', 'brandId', 'typeId', [Sequelize.literal('price/"newPrice"'), 'discount']
        // ],
        attributes: {
          include: [[Sequelize.literal('price/"newPrice"'), 'discount']],
        },
        order,
      });
    } else {
      products = await product.findAndCountAll({
        where: { typeId, brandId, name: { [Op.like]: `%${name}%` } },
        limit,
        offset,
        // attributes: [
        //   'id', 'name', 'price', 'newPrice', 'rating', 'img', 'brandId', 'typeId', [Sequelize.literal('price/"newPrice"'), 'discount']
        // ],
        attributes: {
          include: [[Sequelize.literal('price/"newPrice"'), 'discount']],
        },
        order,
      });
    }
    res.json(products);
  } catch (err) {
    next(new Error(err.message));
  }
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

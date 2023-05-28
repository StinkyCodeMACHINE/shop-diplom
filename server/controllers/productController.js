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
      console.log(
        `id: ${element.id} key: ${element.key}, value: ${element.value}`
      );
    });

    if (info) {
      info = JSON.parse(info);
      info.forEach((element) => {
        productInfo.create({
          key: element.key,
          value: element.value,
          productId: productElem.id,
          typeDefaultInfoId: element.id,
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
    let {
      brandId,
      typeId,
      limit,
      page,
      name,
      sorting,
      priceRange,
      selectedInfoInstance,
    } = req.query;
    page = page || 1;
    name = name || "";
    limit = Number(limit) || 9;
    priceRange = !priceRange
      ? {
          priceLowerLimit: 1,
          priceUpperLimit: 999999999,
        }
      : {
          priceLowerLimit: !priceRange.priceLowerLimit
            ? 1
            : priceRange.priceLowerLimit,
          priceUpperLimit: !priceRange.priceUpperLimit
            ? 999999999
            : priceRange.priceUpperLimit,
        };
    const order = sorting &&
      sorting.byWhat && [[sorting.byWhat, sorting.order]];
    let offset = page * limit - limit;
    let products;
    let options;
    const whereInfo =
      selectedInfoInstance && Object.keys(selectedInfoInstance).length > 0
        ? {
            value: selectedInfoInstance.value,
            typeDefaultInfoId: selectedInfoInstance.typeDefaultInfoId,
          }
        : {};

    const include =
      selectedInfoInstance && Object.keys(selectedInfoInstance).length > 0
        ? {
            include: {
              model: productInfo,
              as: "info",
              where: whereInfo,
            },
          }
        : {};

    if (!brandId && !typeId) {
      options = {
        where: {
          name: { [Op.like]: `%${name}%` },
          price: {
            [Op.between]: [
              priceRange.priceLowerLimit,
              priceRange.priceUpperLimit,
            ],
          },
        },
        attributes: {
          include: [[Sequelize.literal('price/"newPrice"'), "discount"]],
        },
        order,
        ...include
      };
      // count = await product.findAll(options);
      products = await product.findAndCountAll({
        ...options,
        limit,
        offset,
      });
    } else if (brandId && !typeId) {
      options = {
        where: {
          brandId,
          name: { [Op.like]: `%${name}%` },
          price: {
            [Op.between]: [
              priceRange.priceLowerLimit,
              priceRange.priceUpperLimit,
            ],
          },
        },
        attributes: {
          include: [[Sequelize.literal('price/"newPrice"'), "discount"]],
        },
        order,
        ...include
      };
      // count = await product.findAll(options);
      products = await product.findAndCountAll({
        ...options,
        limit,
        offset,
      });
    } else if (!brandId && typeId) {
      options = {
        where: {
          typeId,
          name: { [Op.like]: `%${name}%` },
          price: {
            [Op.between]: [
              priceRange.priceLowerLimit,
              priceRange.priceUpperLimit,
            ],
          },
        },
        attributes: {
          include: [[Sequelize.literal('price/"newPrice"'), "discount"]],
        },
        order,
        ...include
      };
      // count = await product.findAll(options);
      products = await product.findAndCountAll({
        ...options,
        limit,
        offset,
      });
    } else {
      options = {
        where: {
          typeId,
          brandId,
          name: { [Op.like]: `%${name}%` },
          price: {
            [Op.between]: [
              priceRange.priceLowerLimit,
              priceRange.priceUpperLimit,
            ],
          },
        },
        attributes: {
          include: [[Sequelize.literal('price/"newPrice"'), "discount"]],
        },
        order,
        ...include
      };
      // count = await product.findAll(options);
      products = await product.findAndCountAll({
        ...options,
        limit,
        offset,
      });
    }
    res.json({ rows: products.rows, count: products.count });
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

const uuid = require("uuid"); // генерирует случайные id
const path = require("path");
const { product, productInfo, favourite } = require("../db/models");
const { Op } = require("sequelize");

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
      info,
      img: fileNames,
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

async function addToFavourite(req, res, next) {
  try {
    const { productId, userId } = req.body;

    const favouriteElem = await favourite.create({
      productId,
      userId,
    });

    res.json(favouriteElem);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function removeFromFavourite(req, res, next) {
  try {
    let { id } = req.params;

    const favouriteElem = await favourite.destroy({
      where: {
        productId: id,
      },
    });
    res.json(favouriteElem);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getFavouriteProducts(req, res, next) {
  try {
    let { limit, page, userId } = req.query;
    page = page || 1;
    limit = Number(limit) || 9;
    let offset = page * limit - limit;
    let products;
    products = await product.findAndCountAll({
      limit,
      offset,
      include: {
        model: favourite,
        required: true,
      },
    });
   
    res.json(products);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getFavouriteId(req, res, next) {
  try {
    const { userId } = req.query;
    const { id } = req.params;
    const favouriteIds = await favourite.find({
      where: {
        userId,
        id,
      },
    });

    res.json(favouriteIds);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getAll(req, res) {
  try {
    let { brandId, typeId, limit, page, name } = req.query;
    page = page || 1;
    name = name || "";
    limit = Number(limit) || 9;
    let offset = page * limit - limit;
    let products;
    if (!brandId && !typeId) {
      products = await product.findAndCountAll({
        where: { name: { [Op.like]: `%${name}%` } },
        limit,
        offset,
      });
    } else if (brandId && !typeId) {
      products = await product.findAndCountAll({
        where: { brandId, name: { [Op.like]: `%${name}%` } },
        limit,
        offset,
      });
    } else if (!brandId && typeId) {
      products = await product.findAndCountAll({
        where: { typeId, name: { [Op.like]: `%${name}%` } },
        limit,
        offset,
      });
    } else {
      products = await product.findAndCountAll({
        where: { typeId, brandId, name: { [Op.like]: `%${name}%` } },
        limit,
        offset,
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
  addToFavourite,
  removeFromFavourite,
  getFavouriteProducts,
  getFavouriteId,
};

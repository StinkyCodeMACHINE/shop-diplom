const { product, favourite } = require("../db/models");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");

async function addToFavourite(req, res, next) {
  try {
    const { productId} = req.body;

    const favouriteElem = await favourite.create({
      productId,
      userId: req.user.id,
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
    let { limit, page} = req.query;
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
        where: {
          userId: req.user.id
        },
      },
    });

    res.json(products);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getFavouriteIds(req, res, next) {
  try {
    const favouriteIds = await favourite.findAll({
      where: {
        userId: req.user.id,
      },
    });

    res.json(favouriteIds);
  } catch (err) {
    next(new Error(err.message));
  }
}

module.exports = {
  addToFavourite,
  removeFromFavourite,
  getFavouriteProducts,
  getFavouriteIds,
};

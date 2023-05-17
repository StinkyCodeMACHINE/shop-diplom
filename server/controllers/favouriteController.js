const { product, favourite } = require("../db/models");

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

async function getFavouriteIds(req, res, next) {
  try {
    let { userId } = req.query;
    const favouriteIds = await favourite.findAll({
      where: {
        userId,
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

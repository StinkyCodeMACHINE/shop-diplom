const uuid = require("uuid"); // генерирует случайные id
const path = require("path");
const {
  product,
  productInfo,
  favourite,
  review,
  user,
  reviewRating,
} = require("../db/models");
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
        fileNames.push(uuid.v4() + ".png");
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
      fileNames.push(uuid.v4() + ".png");
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
    limit = Number(limit) || 5;
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
    const order =
      sorting && sorting.byWhat ? [[sorting.byWhat, sorting.order]] : [];
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
        order,
        ...include,
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
        order,
        ...include,
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
        order,
        ...include,
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
        order,
        ...include,
      };
      // count = await product.findAll(options);
      products = await product.findAndCountAll({
        ...options,
        limit,
        offset,
      });
    }
    res.json(products);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getOne(req, res, next) {
  try {
    const { id } = req.params;
    const productElem = await product.findOne({
      where: { id },
      include: {
        model: productInfo,
        as: "info",
      },
    });
    res.json(productElem);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function leaveReview(req, res, next) {
  try {
    const { id } = req.params;
    const { advantages, disadvantages, text, rating, reviewCount } = req.body;
    const reviewElem = await review.upsert({
      advantages,
      disadvantages,
      text,
      rating: rating,
      userId: req.user.id,
      productId: id,
    });
    let newRating = 0;
    reviewCount.reviews.forEach(
      (elem) => (newRating = newRating + elem.rating * elem.count)
    );
    newRating = parseFloat(
      (newRating + rating) / (reviewCount.totalCount + 1)
    ).toFixed(2);
    const productElem = await product.update(
      {
        rating: newRating,
      },
      {
        where: {
          id,
        },
        returning: true,
      }
    );
    res.json({ review: reviewElem[0], product: productElem[1][0] });
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getReviews(req, res, next) {
  try {
    const { id } = req.params;
    let { limit, sorting, page } = req.query;
    limit = limit || 5;
    page = page || 1;
    const offset = page * limit - limit;
    const order =
      sorting && sorting.byWhat ? [[sorting.byWhat, sorting.order]] : [];
    const reviews = await review.findAndCountAll({
      where: {
        productId: id,
      },
      attributes: {
        include: [[Sequelize.literal('"thumbsUp"-"thumbsDown"'), "diff"]],
      },
      include: {
        model: user,
        as: "user",
      },
      order,
      limit,
      offset,
    });

    res.json(reviews);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getReview(req, res, next) {
  try {
    const { id } = req.params;
    const reviewElem = await review.findOne({
      where: {
        productId: id,
        userId: req.user.id,
      },
      include: {
        model: user,
        as: "user",
      },
    });

    res.json(reviewElem);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function countReviews(req, res, next) {
  try {
    const { id } = req.params;
    const reviews = await review.findAll({
      attributes: [
        "rating",
        [Sequelize.fn("COUNT", Sequelize.col("rating")), "count"],
      ],
      where: {
        productId: id,
      },
      group: ["rating"],
      order: [["rating", "ASC"]],
    });
    let totalCount = 0;
    reviews.forEach(
      (elem) => (totalCount = totalCount + Number(elem.dataValues.count))
    );
    res.json({ totalCount, reviews });
  } catch (err) {
    next(new Error(err.message));
  }
}

async function rateReview(req, res, next) {
  try {
    const { reviewId } = req.params;
    const { liked } = req.body;
    const foundRating = await reviewRating.findOne({
      where: { userId: req.user.id, reviewId },
    });
    const notChanged = foundRating && foundRating.liked === liked;
    const reviewRatingElem = await reviewRating.upsert({
      liked,
      userId: req.user.id,
      reviewId,
    });
    const what = liked
      ? {
          thumbsUp: notChanged
            ? Sequelize.literal('"thumbsUp"')
            : Sequelize.literal('"thumbsUp" + 1'),
          thumbsDown: notChanged
            ? Sequelize.literal('"thumbsDown"')
            : Sequelize.literal('"thumbsDown"-1'),
        }
      : {
          thumbsUp: notChanged
            ? Sequelize.literal('"thumbsUp"')
            : Sequelize.literal('"thumbsUp" - 1'),
          thumbsDown: notChanged
            ? Sequelize.literal('"thumbsDown"')
            : Sequelize.literal('"thumbsDown"+1'),
        };

    const reviewElem = await review.update(what, {
      where: {
        id: reviewId,
      },
      returning: true,
    });
    res.json({
      reviewRating: reviewRatingElem[0],
      review: reviewElem[1][0],
    });
  } catch (err) {
    next(new Error(err.message));
  }
}

async function deleteReviewRating(req, res, next) {
  try {
    const { reviewId } = req.params;
    await reviewRating.destroy({
      where: {
        reviewId,
        userId: req.user.id,
      },
    });
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getReviewRatings(req, res, next) {
  try {
    const { id } = req.params;
    const reviewRatings = await reviewRating.findAll({
      where: {
        userId: req.user.id,
      },
      include: {
        model: review,
        as: "review",
        where: {
          productId: id,
        },
      },
    });

    res.json(reviewRatings);
  } catch (err) {
    next(new Error(err.message));
  }
}

module.exports = {
  create,
  getAll,
  getOne,
  leaveReview,
  getReviews,
  getReview,
  countReviews,
  rateReview,
  deleteReviewRating,
  getReviewRatings,
};

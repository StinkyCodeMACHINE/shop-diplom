const uuid = require("uuid"); // генерирует случайные id
const path = require("path");
const axios = require("axios");
const {
  product,
  productInfo,
  favourite,
  review,
  user,
  reviewRating,
  type,
  group,
  brand,
} = require("../db/models");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const whatsappclient = require("../service/whatsapp");
const ExcelJS = require("exceljs");
const fs = require("fs");

async function create(req, res, next) {
  try {
    let {
      name,
      price,
      brandId,
      typeId,
      info,
      discount,
      isHyped,
      description,
      left,
    } = req.body;
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
      description,
      left,
      isHyped,
      discount,
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
        if (element.value !== "") {
          productInfo.create({
            key: element.key,
            value: element.value.toLowerCase(),
            productId: productElem.id,
            typeDefaultInfoId: element.id,
            typeId: productElem.typeId,
          });
        }
        
      });
    }

    res.json(productElem);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function loadFromExcel(req, res, next) {
  try {
    const { excel } = req.files;
    const types = await type.findAll();
    const brands = await brand.findAll();

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(excel.data);
    const workSheet = workbook.worksheets[0];
    let createdAmount = 0;
    let updatedAmount = 0;

    for (let i = 2; i <= workSheet.rowCount; i++) {
      try {
        const row = workSheet.getRow(i);

        const foundProduct = await product.findOne({
          where: {
            name: row.values[3],
          },
        });

        if (foundProduct) {
          await product.update(
            {
              left: Sequelize.literal(`"left" + ${row.values[9]}`),
            },
            {
              where: {
                id: foundProduct.id,
              },
            }
          );
          updatedAmount = updatedAmount + 1;
        } else {
          const links = typeof row.values[6] === 'object' ? row.values[6].hyperlink.split(",") : row.values[6].split(",");
          const fileNames = [];

          const response = [];
          for (let j = 0; j < links.length; j++) {
            try {
              const img = await axios.get(links[j], {
                responseType: "arraybuffer",
              });
              fileNames.push(uuid.v4() + ".png");
              response.push(img);
            }
            catch (err) {
              console.log(err)
            }
            
            
          }

          const foundTypeId = types.find(
            (type) => type.name.localeCompare(row.values[1], undefined, {sensitivity: 'accent'}) === 0
          ).id;
          const foundBrandId = brands.find(
            (brand) =>
              (brand.name.localeCompare(row.values[2], undefined, {sensitivity: "accent"}) === 0)
          ).id;
          if (!foundTypeId || !foundBrandId) {
            return next(new Error("Не найден бренд или категория"))
          }

          const productElem = await product.create({
            name: row.values[3],
            price: row.values[4],
            brandId: foundBrandId,
            typeId: foundTypeId,
            img: fileNames,
            description: row.values[7],
            left: row.values[9],
            discount: 1 - row.values[5],
          });

          createdAmount = createdAmount + 1;

          try {
            for (let j = 0; j < fileNames.length; j++) {
              await fs.writeFile(
                path.resolve(
                  __dirname,
                  "..",
                  "static",
                  "product-images",
                  fileNames[j]
                ),
                response[j].data,
                (err) => {
                  if (err) {
                    console.log(err);
                  }
                }
              );
            }
          } catch (axiosErr) {
            console.log(axiosErr);
          }

          const info = row.values[8].split(",");

          if (info) {
            info.forEach((element) => {
              if (element.value !== "") {
                productInfo.create({
                  key: isNaN(element.split(":")[0])
                    ? element.split(":")[0].charAt(0).toUpperCase() +
                      element.split(":")[0].slice(1)
                    : element.split(":")[0],
                  value: isNaN(element.split(":")[1])
                    ? element.split(":")[1].toLowerCase()
                    : element.split(":")[1],
                  productId: productElem.id,
                  typeId: foundTypeId,
                });
              }
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    }

    // ... use workbook
    res.json({ createdAmount, updatedAmount });
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
      inStock,
    } = req.query;
    page = page || 1;
    name = name || "";
    limit = Number(limit) || 5;
    inStock = inStock && JSON.parse(inStock);
    const leftCondition = inStock
      ? {
          left: {
            [Op.or]: {
              [Op.gt]: 0,
              [Op.eq]: null,
            },
          },
        }
      : {};
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
      sorting && sorting.byWhat
        ? [[sorting.byWhat, sorting.order]]
        : [["id", "ASC"]];
    let offset = page * limit - limit;
    let products;
    let options;
    const whereInfo =
      selectedInfoInstance && Object.keys(selectedInfoInstance).length > 0
        ? {
            value: selectedInfoInstance.value,
            typeId: selectedInfoInstance.typeId,
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
          name: { [Op.iLike]: `%${name}%` },
          price: {
            [Op.between]: [
              priceRange.priceLowerLimit,
              priceRange.priceUpperLimit,
            ],
          },
          ...leftCondition,
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
          name: { [Op.iLike]: `%${name}%` },
          price: {
            [Op.between]: [
              priceRange.priceLowerLimit,
              priceRange.priceUpperLimit,
            ],
          },
          ...leftCondition,
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
          name: { [Op.iLike]: `%${name}%` },
          price: {
            [Op.between]: [
              priceRange.priceLowerLimit,
              priceRange.priceUpperLimit,
            ],
          },
          ...leftCondition,
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
          name: { [Op.iLike]: `%${name}%` },
          price: {
            [Op.between]: [
              priceRange.priceLowerLimit,
              priceRange.priceUpperLimit,
            ],
          },
          ...leftCondition,
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
    const foundReview = await review.findOne({
      where: {
        productId: id,
        userId: req.user.id,
      },
    });
    if (foundReview) {
      const updatedReview = await review.update(
        {
          advantages,
          disadvantages,
          text,
          rating,
        },
        {
          where: {
            productId: id,
            userId: req.user.id,
          },
          returning: true,
        }
      );

      const deletedReviewRatings = await reviewRating.destroy({
        where: {
          reviewId: id,
        },
      });

      let newRating = 0;
      if (reviewCount.reviews.length > 0) {
        reviewCount.reviews.forEach(
          (elem) => (newRating = newRating + elem.rating * Number(elem.count))
        );
        newRating = parseFloat(
          (newRating + rating) / (reviewCount.totalCount + 1)
        ).toFixed(2);
      } else {
        newRating = rating;
      }

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
      res.json({ review: updatedReview[1][0], product: productElem[1][0] });
    } else {
      const reviewElem = await review.create({
        advantages,
        disadvantages,
        text,
        rating,
        userId: req.user.id,
        productId: id,
      });
      let newRating = 0;
      if (reviewCount.reviews.length > 0) {
        reviewCount.reviews.forEach(
          (elem) => (newRating = newRating + elem.rating * Number(elem.count))
        );
        newRating = parseFloat(
          (newRating + rating) / (reviewCount.totalCount + 1)
        ).toFixed(2);
      } else {
        newRating = rating;
      }

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
      res.json({ review: reviewElem, product: productElem[1][0] });
    }
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

async function getAllReviews(req, res, next) {
  try {
    let { page, limit, searchValue } = req.query;
    const condition = searchValue
      ? {
          where: {
            id: Number(searchValue),
          },
        }
      : {};
    limit = limit || 5;
    page = page || 1;
    const offset = page * limit - limit;
    const reviews = await review.findAndCountAll({
      attributes: {
        include: [[Sequelize.literal('"thumbsUp"-"thumbsDown"'), "diff"]],
      },
      include: {
        model: user,
        as: "user",
      },
      limit,
      offset,
      ...condition,
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

async function deleteReview(req, res, next) {
  try {
    const { id } = req.params;
    const { reviewCount, rating } = req.body;

    const deletedReviewRating = await review.destroy({
      where: {
        id: id,
      },
    });

    let newRating = 0;
    if (reviewCount && reviewCount.length > 0) {
      reviewCount.reviews.forEach(
        (elem) => (newRating = newRating + elem.rating * elem.count)
      );
      newRating = parseFloat(
        (newRating - rating) / (reviewCount.totalCount - 1)
      ).toFixed(2);
    }

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

    res.json(deletedReviewRating);
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
    const reviewRatingElem = await reviewRating.upsert({
      liked,
      userId: req.user.id,
      reviewId,
    });
    const what = liked
      ? {
          thumbsUp: Sequelize.literal('"thumbsUp" + 1'),
          thumbsDown: foundRating
            ? Sequelize.literal('"thumbsDown"-1')
            : Sequelize.literal('"thumbsDown"'),
        }
      : {
          thumbsUp: foundRating
            ? Sequelize.literal('"thumbsUp" - 1')
            : Sequelize.literal('"thumbsUp"'),
          thumbsDown: Sequelize.literal('"thumbsDown" + 1'),
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
    const foundReviewRating = await reviewRating.findOne({
      where: {
        reviewId,
        userId: req.user.id,
      },
    });
    const deletedReviewRating = await reviewRating.destroy({
      where: {
        reviewId,
        userId: req.user.id,
      },
    });
    const what = foundReviewRating.liked
      ? {
          thumbsUp: Sequelize.literal('"thumbsUp" - 1'),
        }
      : {
          thumbsDown: Sequelize.literal('"thumbsDown" - 1'),
        };

    const reviewElem = await review.update(what, {
      where: {
        id: reviewId,
      },
      returning: true,
    });
    res.json(deletedReviewRating);
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

async function changeProduct(req, res, next) {
  try {
    const { id } = req.params;
    let {
      name,
      price,
      brandId,
      typeId,
      isHyped,
      info,
      discount,
      description,
      left,
    } = req.body;
    const img = req.files && req.files.img;
    const fileNames = [];
    if (img && Array.isArray(img)) {
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
    } else if (img) {
      fileNames.push(uuid.v4() + ".png");
      img.mv(
        path.resolve(__dirname, "..", "static", "product-images", fileNames[0])
      );
    }

    const foundProduct = await product.findOne({
      where: {
        id,
      },
    });
    const productElem = await product.update(
      {
        name,
        price,
        brandId,
        typeId,
        img: img ? fileNames : Sequelize.literal('"img"'),
        description,
        left,
        isHyped,
        discount,
      },
      {
        where: {
          id,
        },
      }
    );

    const prevInfo = await productInfo.findAll({
      where: {
        productId: id,
      },
    });

    if (info) {
      info = JSON.parse(info);
      prevInfo.forEach((prevInfoElem) => {
        if (!info.find((infoElem) => infoElem.key === prevInfoElem.key)) {
          productInfo.destroy({
            where: {
              id: prevInfoElem.id,
            },
          });
        } else {
          info = info.filter((elem) => elem.key !== prevInfoElem.key);
        }
      });

      info.forEach((element) => {
        if (element.value !== "") {
          productInfo.create({
            key: element.key,
            value: element.value.toLowerCase(),
            productId: id,
            typeDefaultInfoId: element.id,
            typeId,
          });
        }
        
      });
    }

    if (
      discount &&
      Math.ceil(foundProduct.discount * 100) > Math.ceil(discount * 100) &&
      discount != 1
    ) {
      const favouriteProducts = await favourite.findAll({
        where: {
          productId: id,
        },
        include: {
          model: product,
          as: "product",
        },
      });
      if (favouriteProducts.length > 0) {
        for (let i = 0; i < favouriteProducts.length; i++) {
          const userElem = await user.findOne({
            where: {
              id: favouriteProducts[i].userId,
            },
          });
          const number = userElem.phone;

          const number_details = await whatsappclient.getNumberId(number);

          if (number_details) {
            const sendMessageData = await whatsappclient.sendMessage(
              number_details._serialized,
              `Понравившийся вам товар, "${
                favouriteProducts[i].product.name
              }", продается с ${Math.ceil((1 - discount) * 100)}% скидкой!`
            );
          }
        }
      }
    }

    res.json(productElem);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { img } = req.query;

    img &&
      img.forEach((imgElem) => {
        fs.unlink(
          path.resolve(__dirname, "..", "static", "product-images", imgElem),
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
      });

    const result = await product.destroy({
      where: {
        id,
      },
    });
    res.json(result);
  } catch (err) {
    next(new Error(err.message));
  }
}

module.exports = {
  create,
  loadFromExcel,
  getAll,
  getOne,
  leaveReview,
  getReviews,
  getReview,
  countReviews,
  rateReview,
  deleteReviewRating,
  getReviewRatings,
  deleteProduct,
  changeProduct,
  getAllReviews,
  deleteReview,
};

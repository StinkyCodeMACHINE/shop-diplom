const { product, favourite, banner } = require("../db/models");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const fs = require("fs");
const uuid = require("uuid");
const path = require("path");

async function createBanner(req, res, next) {
  try {
    let { brandId, typeId } = req.body;
    brandId = brandId === "null" ? null : brandId;
    typeId = typeId === "null" ? null : typeId;
    const { img } = req.files;
    let fileName = uuid.v4() + ".png";
    const bannerElem = await banner.create({ brandId, img: fileName, typeId });
    img.mv(path.resolve(__dirname, "..", "static", "banner-images", fileName));

    res.json(bannerElem);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getBanners(req, res) {
  let { searchValue } = req.query;
  const additionalConditions =
    searchValue && !isNaN(searchValue)
      ? {
          where: {
            id: Number(searchValue),
          },
        }
      : {};

  const banners = await banner.findAll({
    ...additionalConditions,
  });
  res.json(banners);
}

async function changeBanner(req, res, next) {
  try {
    const { id } = req.params;
    let { brandId, typeId} = req.body;
    brandId = brandId === "null" ? null : brandId;
    typeId = typeId === "null" ? null : typeId;
    const img = req.files && req.files.img;
    let fileName = uuid.v4() + ".png";

    const result = await banner.update(
      {
        brandId,
        img: img ? fileName : Sequelize.literal('"img"'),
        typeId,
      },
      {
        where: {
          id,
        },
      }
    );
    if (img) {
      img.mv(path.resolve(__dirname, "..", "static", "type-images", fileName));
    }

    res.json(result);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function deleteBanner(req, res, next) {
  try {
    const { id } = req.params;
    const { img } = req.query;

    const deletionPath =
      img && path.resolve(__dirname, "..", "static", "banner-images", img);
    img &&
      fs.unlink(deletionPath, (err) => {
        if (err) {
          console.log(err);
        }
      });

    const result = await banner.destroy({
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
  createBanner,
  getBanners,
  changeBanner,
  deleteBanner,
};

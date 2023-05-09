const uuid = require("uuid"); // генерирует случайные id
const path = require("path");
const { device, deviceInfo } = require("../db/models");

async function create(req, res, next) {
  try {
    let { name, price, brandId, typeId, info } = req.body;
    const { img } = req.files;
    let fileName = uuid.v4() + ".jpg";
    img.mv(path.resolve(__dirname, "..", "static", "product-images", fileName));

    const deviceElem = await device.create({
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
        deviceInfo.create({
          title: element.title,
          description: element.description,
          deviceId: deviceElem.id,
        });
      });
    }

    res.json(deviceElem);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getAll(req, res) {
  let { brandId, typeId, limit, page } = req.query;
  page = page || 1;
  limit = Number(limit) || 9;
  let offset = page * limit - limit;
  let devices;
  if (!brandId && !typeId) {
    devices = await device.findAndCountAll({
      limit,
      offset,
    });
  } else if (brandId && !typeId) {
    devices = await device.findAndCountAll({
      where: { brandId },
      limit,
      offset,
    });
  } else if (!brandId && typeId) {
    devices = await device.findAndCountAll({
      where: { typeId },
      limit,
      offset,
    });
  } else {
    devices = await device.findAndCountAll({
      where: { typeId, brandId },
      limit,
      offset
    });
  }
  res.json(devices);
}

async function getOne(req, res) {
  const { id } = req.params;
  const deviceElem = await device.findOne({
    where: { id },
    include: {
      model: deviceInfo,
      as: "info",
    },
  });
  res.json(deviceElem);
}

module.exports = {
  create,
  getAll,
  getOne,
};


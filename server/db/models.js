const sequelize = require("./db");
const { DataTypes } = require("sequelize");

const user = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
});

const basket = sequelize.define("basket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const basketDevice = sequelize.define("basket_device", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const device = sequelize.define("device", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, defaultValue: 0 },
  img: { type: DataTypes.STRING, allowNull: false },
});

const type = sequelize.define("type", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const brand = sequelize.define("brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const rating = sequelize.define("rating", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rating: { type: DataTypes.STRING, allowNull: false },
});

const deviceInfo = sequelize.define("device_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

const typeBrand = sequelize.define("type_brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

user.hasOne(basket);
basket.belongsTo(user);

user.hasMany(rating);
rating.belongsTo(user);

basket.hasMany(basketDevice);
basketDevice.belongsTo(basket);

device.hasMany(basketDevice);
basketDevice.belongsTo(device);

device.hasMany(deviceInfo, {as: 'info'});
deviceInfo.belongsTo(device);

device.hasMany(rating);
rating.belongsTo(device);

brand.hasMany(device);
device.belongsTo(brand);

type.hasMany(device);
device.belongsTo(type);

type.belongsToMany(brand, { through: typeBrand });
brand.belongsToMany(type, { through: typeBrand });

module.exports = {
  user,
  basket,
  basketDevice,
  device,
  type,
  brand,
  rating,
  typeBrand,
  deviceInfo,
};

const db = require("./db");
const moment = require("moment");
const { DataTypes } = require("sequelize");

const user = db.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, defaultValue: "Кто-то", allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
  isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
  activationLink: { type: DataTypes.STRING },
  img: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING, }
});

const order = db.define("order", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  status: { type: DataTypes.STRING, allowNull: false },
  money: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
  phone: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING, allowNull: false},
});

const orderProduct = db.define("orderProduct", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: { min: 1 },
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: { min: 1 },
  },
});

const product = db.define("product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: {
    type: DataTypes.STRING,
    notEmpty: true,
    unique: true,
    allowNull: false,
  },
  price: { type: DataTypes.INTEGER, allowNull: false },
  discount: { type: DataTypes.FLOAT, defaultValue: 1, validate: { min: 1 } },
  rating: { type: DataTypes.FLOAT, defaultValue: 0, validate: { max: 5 } },
  isHyped: { type: DataTypes.BOOLEAN, defaultValue: false},
  img: { type: DataTypes.JSON, allowNull: false },
  description: { type: DataTypes.TEXT, notEmpty: true }, //заменить allowNull:false
  left: { type: DataTypes.INTEGER, validate: { min: 0 } },
});

const favourite = db.define(
  "favourite",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  {
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["productId"],
      },
    ],
  }
);

const group = db.define("group", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: {
    type: DataTypes.STRING,
    notEmpty: true,
    unique: true,
    allowNull: false,
  },
  img: { type: DataTypes.STRING }, // заменить allowNull: false
});

const type = db.define("type", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: {
    type: DataTypes.STRING,
    notEmpty: true,
    unique: true,
    allowNull: false,
  },
  img: { type: DataTypes.STRING }, // заменить allowNull: false
});

const defaultTypeInfo = db.define(
  "typeDefaultInfo",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    key: { type: DataTypes.STRING, allowNull: false },
  },
  { freezeTableName: true }
);

const brand = db.define("brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, notEmpty: true, unique: true, allowNull: false },
  img: { type: DataTypes.STRING }, // заменить allowNull: false
});

const review = db.define(
  "review",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    thumbsUp: { type: DataTypes.INTEGER, defaultValue: 0 },
    thumbsDown: { type: DataTypes.INTEGER, defaultValue: 0 },
    advantages: { type: DataTypes.TEXT },
    disadvantages: { type: DataTypes.TEXT },
    text: { type: DataTypes.TEXT, allowNull: false },
    rating: { type: DataTypes.INTEGER, validate: { max: 5 } },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId"],
      },
    ],
  }
);

const reviewRating = db.define(
  "reviewRating",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    liked: { type: DataTypes.BOOLEAN },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["reviewId"],
      },
    ],
  }
);

const productInfo = db.define(
  "productInfo",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    key: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.STRING, allowNull: false },
  },
  { freezeTableName: true }
);

user.hasOne(order);
order.belongsTo(user);

user.hasMany(review);
review.belongsTo(user);

user.hasMany(favourite);
favourite.belongsTo(user);

user.hasMany(reviewRating);
reviewRating.belongsTo(user);

order.hasMany(orderProduct);
orderProduct.belongsTo(order);

product.hasMany(orderProduct);
orderProduct.belongsTo(product);

product.hasMany(productInfo, { as: "info" });
productInfo.belongsTo(product);

review.hasMany(reviewRating);
reviewRating.belongsTo(review);

product.hasMany(review);
review.belongsTo(product);

product.hasOne(favourite);
favourite.belongsTo(product);

brand.hasMany(product);
product.belongsTo(brand);

group.hasMany(type);
type.belongsTo(group);

type.hasMany(product);
product.belongsTo(type);

type.hasMany(defaultTypeInfo);
defaultTypeInfo.belongsTo(type);

defaultTypeInfo.hasMany(productInfo);
productInfo.belongsTo(defaultTypeInfo);

module.exports = {
  user,
  order,
  orderProduct,
  product,
  group,
  type,
  defaultTypeInfo,
  brand,
  review,
  reviewRating,
  productInfo,
  favourite,
};

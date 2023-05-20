const db = require("./db");
const { DataTypes } = require("sequelize");

const user = db.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, defaultValue: "Кто-то", allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
  isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
  activationLink: { type: DataTypes.TEXT },
});

const basket = db.define("basket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const basketProduct = db.define("basket_product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const product = db.define("product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  newPrice: { type: DataTypes.INTEGER },
  rating: { type: DataTypes.INTEGER, defaultValue: 0 },
  img: { type: DataTypes.JSON, allowNull: false },
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
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  img: { type: DataTypes.STRING }, // заменить allowNull: false
});

const type = db.define("type", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  img: { type: DataTypes.STRING }, // заменить allowNull: false
});

const brand = db.define("brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  img: { type: DataTypes.STRING }, // заменить allowNull: false
});

const review = db.define("review", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  thumbsUp: { type: DataTypes.INTEGER },
  thumbsDown: { type: DataTypes.INTEGER },
  text: { type: DataTypes.STRING },
  date: { type: DataTypes.DATE },
  rating: { type: DataTypes.INTEGER },
});

const productInfo = db.define(
  "product_info",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
  },
  { freezeTableName: true }
);

user.hasOne(basket);
basket.belongsTo(user);

user.hasMany(review);
review.belongsTo(user);

user.hasMany(favourite);
favourite.belongsTo(user);

basket.hasMany(basketProduct);
basketProduct.belongsTo(basket);

product.hasMany(basketProduct);
basketProduct.belongsTo(product);

product.hasMany(productInfo, { as: "info" });
productInfo.belongsTo(product);

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

module.exports = {
  user,
  basket,
  basketProduct,
  product,
  group,
  type,
  brand,
  review,
  productInfo,
  favourite,
};

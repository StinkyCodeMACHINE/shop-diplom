const { order, orderProduct, product } = require("../db/models");
const { Sequelize } = require("sequelize");

async function createOrder(req, res, next) {
  try {
    const { cart, phone, email, name, address } = req.body;
    const orderElem = await order.create({
      status: "В доставке",
      money: cart.reduce((money, elem) => money + elem.finalPrice, 0),
      phone,
      address,
      email: !email ? null : email,
      name,
      userId: req.user.id,
    });
    if (cart) {
      for (let i = 0; i < cart.length; i++) {
        const productElem = await product.findOne({
          where: {
            id: cart[i].id,
          },
        });
        const diff =
          productElem.left - cart[i].amount < 0
            ? 0
            : productElem.left - cart[i].amount;
        await product.update(
          {
            left: productElem.left === null ? null : diff,
          },
          {
            where: {
              id: cart[i].id,
            },
          }
        );

        await orderProduct.create({
          orderId: orderElem.id,
          productId: cart[i].id,
          amount: cart[i].amount,
          price: cart[i].finalPrice,
        });
      }
    }

    res.json(orderElem);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getOrders(req, res, next) {
  try {
    const orders = await order.findAll({
      where: {
        userId: req.user.id,
      },
      include: {
        model: orderProduct,
        as: "orderProducts",
        include: {
          model: product,
          as: "product",
        },
      },
      order: [['id','ASC']]
    });

    res.json(orders);
  } catch (err) {
    next(new Error(err.message));
  }
}

module.exports = {
  createOrder,
  getOrders,
};

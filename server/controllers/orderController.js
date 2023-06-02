const { order, orderProduct, product } = require("../db/models");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");

async function createOrder(req, res, next) {
  try {
    const { cart, phone, email, name, address } = req.body;
    const orderElem = await order.create({
      status: "Придёт в течение недели",
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
      order: [["id", "ASC"]],
    });

    res.json(orders);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getAllOrders(req, res, next) {
  try {
    const {searchValue} = req.query
    const condition = searchValue ? {
      where: {
        id: Number(searchValue)
      } 
    }
      : {}
    
    const orders = await order.findAll({
      include: {
        model: orderProduct,
        as: "orderProducts",
        include: {
          model: product,
          as: "product",
        },
      },
      ...condition,
      order: [["id", "ASC"]],
    });

    res.json(orders);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function changeStatus(req, res, next) {
  try {
    const { id } = req.params;
    const result = await order.update(
      {
        status: "Доставлено"
      },
      {
        where: {
          id,
        },
      }
    );
    res.json(result);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function deleteOrder(req, res, next) {
  try {
    const { id } = req.params;
    const orders = await order.findOne({
      include: {
        model: orderProduct,
        as: "orderProducts",
        include: {
          model: product,
          as: "product",
        },
      },
      where: {
        id,
      },
    });

    for (let i = 0; i<orders.orderProducts.length; i++) {
      const result = await product.update(
        {
          left: Sequelize.literal(`"left" + ${orders.orderProducts[i].amount}`),
        },
        {
          where: {
            id: orders.orderProducts[i].product.id,
          },
        }
      );
    }

    const result = await order.destroy({
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
  createOrder,
  getOrders,
  getAllOrders,
  changeStatus,
  deleteOrder,
};

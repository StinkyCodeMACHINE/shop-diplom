const { order, orderProduct, product, user } = require("../db/models");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const whatsappclient = require("../service/whatsapp");

async function createOrder(req, res, next) {
  try {
    const { cart, phone, email, name, address } = req.body;
    const orderElem = await order.create({
      status: "Комплектуется",
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

async function setToDelivering(req, res, next) {
  try {
    const { id } = req.params;
    const result = await order.update(
      {
        status: "Передан в доставку"
      },
      {
        where: {
          id,
        },
        returning: true,
      }
    )
    
    const number = result[1][0].phone;

    const number_details = await whatsappclient.getNumberId(number);

    if (number_details) {
      const sendMessageData = await whatsappclient.sendMessage(
        number_details._serialized,
        `Ваш заказ №${id} по адресу "${
          result[1][0].address
        }" общей суммой в ${result[1][0].money
          .toString()
          .replace(
            /\B(?=(\d{3})+(?!\d))/g,
            " "
          )} руб. передан в доставку`
      ); 
    }


    
    res.json(result);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function setToDelivered(req, res, next) {
  try {
    const { id } = req.params;
    const result = await order.update(
      {
        status: "Доставлено",
      },
      {
        where: {
          id,
        },
        returning: true
      }
    );

    const number = result[1][0].phone;

    const number_details = await whatsappclient.getNumberId(number);

    if (number_details) {
      const sendMessageData = await whatsappclient.sendMessage(
        number_details._serialized,
        `Ваш заказ №${id} был успешно доставлен и оплачен. Спасибо за покупку!`
      );
    }

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

async function cancelOrder(req, res, next) {
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
        userId: req.user.id
      },
    });

    for (let i = 0; i < orders.orderProducts.length; i++) {
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
        userId: req.user.id,
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
  setToDelivering,
  setToDelivered,
  deleteOrder,
  cancelOrder
};


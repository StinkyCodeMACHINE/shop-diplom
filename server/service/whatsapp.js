const qrcode = require("qrcode-terminal");
const fs = require("fs");
const {
  Client,
  LegacySessionAuth,
  LocalAuth,
  MessageMedia,
} = require("whatsapp-web.js");
const { review, user, order, orderProduct, product } = require("../db/models");
const path = require("path");
const { Op } = require("sequelize");

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "./whatsappsessiondata",
    clientId: "CLIENT-ID",
  }),
  puppeteer: {
    handleSIGINT: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

process.on("SIGINT", async () => {
  console.log("(SIGINT) Shutting down...");
  await this.client.destroy();
  console.log("client destroyed");
  process.exit(0);
});

// Save session values to the file upon successful auth
client.on("authenticated", (session) => {
  console.log("success");
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("Client is ready!");

});

client.on("message", async (message) => {
  if (message.body === "!заказы") {
    const contact = await message.getContact();
    const numberWithoutCode = contact.number.substring(1);
    const orders = await order.findAll({
      include: [
        {
          model: user,
          as: "user",
          where: {
            phone: "8" + numberWithoutCode,
          },
        },
        {
          model: orderProduct,
          as: "orderProducts",
        },
      ],

      where: {
        status: {
          [Op.ne]: "Доставлено",
        },
      },
    });

    if (orders && orders.length > 0) {
      let response = `Всего ${orders.length} ${
        orders.length === 1 ? "заказ" : orders.length === 2 || orders.length === 3 || orders.length === 4 ? "заказа" : "заказов"
      } ${orders.length === 1 ? "ожидает" : "ожидают"} доставки.`;
      orders.forEach((order) => {
        let totalAmount = 0;

        order.orderProducts.forEach(
          (product) => (totalAmount = totalAmount + product.amount)
        );
        response =
          response +
          `\r\n\r\nЗаказ № ${order.id} для "${order.name}" по адресу "${
            order.address
          }" общей суммой в ${order.money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} руб. и ${totalAmount} товарами: ${order.status.toLowerCase()} `;
      });
      client.sendMessage(message.from, response);
    }
  }

  else if (message.body.includes("!заказ ")) {
    try {
      const contact = await message.getContact();
      const numberWithoutCode = contact.number.substring(1);
      const orderElem = await order.findOne({
        include: [
          {
            model: user,
            as: "user",
            where: {
              phone: "8" + numberWithoutCode,
            },
          },
          {
            model: orderProduct,
            as: "orderProducts",
            include: {
              model: product,
              as: "product",
            }
          },
        ],
        where: {
          id: message.body.split(" ")[1],
        },
      });

      if (orderElem && Object.keys(orderElem).length > 0) {
        let response = ``;
        let totalAmount = 0;

        orderElem.orderProducts.forEach(
          (product) => (totalAmount = totalAmount + product.amount)
        );
        response = `Заказ № ${orderElem.id} для "${
          orderElem.name
        }" по адресу "${orderElem.address}" общей суммой в ${orderElem.money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} руб. и ${totalAmount} товарами: ${orderElem.status.toLowerCase()}\r\n \r\nСодержимое заказа:`;

        orderElem.orderProducts.forEach(
          (orderProduct) =>
            (response =
              response +
              `\r\n\r\n${orderProduct.product.name} в количестве ${
                orderProduct.amount
              } шт. и стоимостью в ${orderProduct.price
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} руб.`)
        );
        client.sendMessage(message.from, response);

      } else {
        client.sendMessage(message.from, "Такой заказ не был найден!");
      }
    }
    catch (err) {
        client.sendMessage(message.from, `Укажите комманду в формате "!заказ *номер заказа*"`);
    }
    
  }
});

module.exports = client;

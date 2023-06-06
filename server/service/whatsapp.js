const qrcode = require("qrcode-terminal");
const fs = require("fs");
const {
  Client,
  LegacySessionAuth,
  LocalAuth,
  MessageMedia,
} = require("whatsapp-web.js");
const { review, user, order, orderProduct } = require("../db/models");
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

  // const number = "89178744986";
  // const sanitized_number = number.toString().replace(/[- )(]/g, "");

  // const number_details = await client.getNumberId(sanitized_number);

  // if (number_details) {
  //   const sendMessageData = await client.sendMessage(number_details._serialized, "aaaaaa");
  // } else {
  //   throw new Error(final_number + " не существует!")
  // }
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
      let response = `Всего у вас ${orders.length} ${
        orders.length === 1 ? "заказ" : "заказа"
      }.\r\n`;
      orders.forEach((order) => {
        let totalAmount = 0;

        order.orderProducts.forEach(
          (product) => (totalAmount = totalAmount + product.amount)
        );
        response =
          response +
          `\r\nЗаказ № ${order.id} для "${order.name}" по адресу "${
            order.address
          }" общей суммой в ${
            order.money
          } руб. и ${totalAmount} товарами: ${order.status.toLowerCase()} \r\n`;
      });
      client.sendMessage(message.from, response);
    }
  }
});

client.on("message", async (message) => {
  if (message.body.includes("!заказ ") && message.body !== "!заказы") {
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
        },
      ],
      where: {
        id: message.body.split(' ')[1],
      },
    });

    if (orderElem && Object.keys(orderElem).length > 0) {
      let response = ``;
      let totalAmount = 0;

      orderElem.orderProducts.forEach(
        (product) => (totalAmount = totalAmount + product.amount)
      );
      response = `\r\nЗаказ № ${orderElem.id} для "${orderElem.name}" по адресу "${
        orderElem.address
      }" общей суммой в ${
        orderElem.money
      } руб. и ${totalAmount} товарами: ${orderElem.status.toLowerCase()} \r\n`;
      client.sendMessage(message.from, response);
    } else {
      client.sendMessage(message.from, "Такой заказ не был найден!");
    }
  }
});

module.exports = client;

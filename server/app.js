const dotenv = require("dotenv");
dotenv.config();
const path = require("path")
const express = require("express");

const db = require("./db/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const cors = require('cors') // разрешает от других ист
const fileUpload = require('express-fileupload')
const port = process.env.PORT || 5500;

const brandRouter = require("./routes/brandRouter");
const productRouter = require("./routes/productRouter");
const groupRouter = require("./routes/groupRouter");
const typeRouter = require("./routes/typeRouter");
const userRouter = require("./routes/userRouter");
const favouriteRouter = require("./routes/favouriteRouter");
const infoRouter = require("./routes/infoRouter");
const orderRouter = require("./routes/orderRouter")
const bannerRouter = require("./routes/bannerRouter")
const { reviewRating, order, review } = require("./db/models");
const whatsappclient = require("./service/whatsapp")

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use("/api/user", userRouter);
app.use("/api/group", groupRouter);
app.use("/api/type", typeRouter);
app.use("/api/brand", brandRouter);
app.use("/api/product", productRouter);
app.use("/api/favourite", favouriteRouter);
app.use("/api/info", infoRouter);
app.use("/api/order", orderRouter);
app.use("/api/banner", bannerRouter);

// Обработка ошибок
app.use(errorHandler)

async function start() {
  try {
    await db.authenticate();
    await db.sync({ alter: true });
    whatsappclient.initialize()
    app.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();



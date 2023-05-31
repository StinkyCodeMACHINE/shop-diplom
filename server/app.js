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
const { reviewRating, order } = require("./db/models");

// разрешение обращения от других источников
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });


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

// Обработка ошибок, последний middleware
app.use(errorHandler)

async function start() {
  try {
    await db.authenticate();
    await db.sync({ alter: true });
    // await db.sync({ force: true });

    app.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();

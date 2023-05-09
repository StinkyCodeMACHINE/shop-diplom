const dotenv = require("dotenv");
dotenv.config();
const path = require("path")
const express = require("express");

const db = require("./db/db");
const errorHandler = require("./middleware/errorHandlingMiddleware");

const app = express();
const cors = require('cors') // разрешает от других ист
const fileUpload = require('express-fileupload')
const port = process.env.PORT || 5500;

const brandRouter = require("./routes/brandRouter");
const deviceRouter = require("./routes/deviceRouter");
const typeRouter = require("./routes/typeRouter");
const userRouter = require("./routes/userRouter");

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
app.use("/api/type", typeRouter);
app.use("/api/brand", brandRouter);
app.use("/api/device", deviceRouter);

// Обработка ошибок, последний middleware
app.use(errorHandler)

async function start() {
  try {
    await db.authenticate();
    await db.sync();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();

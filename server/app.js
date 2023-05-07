const dotenv = require("dotenv");
dotenv.config();
const path = require("path")
const express = require("express");

const sequelize = require("./db/db");
const models = require("./db/models");
const router = require("./routes/index")
const errorHandler = require("./middleware/errorHandlingMiddleware");

const app = express();
const cors = require('cors') // разрешает от других ист
const fileUpload = require('express-fileupload')
const port = process.env.PORT || 5500;

// разрешение обращения от других источников
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });


app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

// Обработка ошибок, последний middleware
app.use(errorHandler)


const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();

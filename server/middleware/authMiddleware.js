const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1]; //bearer sdfadsf
  if (!token) {
    // res.status(401).json({message: "Не задан ключ"})
    throw new Error("Не задан ключ");
  } else {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (e) {
        throw new Error("Пользователь неавторизован")
    }

  }
};

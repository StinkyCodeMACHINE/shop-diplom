const bcrypt = require("bcrypt"); //хеширование паролей
const { user} = require("../db/models");
const jwt = require("jsonwebtoken");
const sendMail = require("../service/mail");
const uuid = require("uuid"); // генерирует случайный текст
const { where } = require("sequelize");
const path = require("path");
const { Sequelize } = require("../db/db");
const { Op } = require("sequelize");

function generateJWT(name, id, email, role, phone, img) {
  return jwt.sign(
    {
      id,
      name,
      email,
      role,
      phone,
      img,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );
}

async function registration(req, res, next) {
  const { name, email, password, role } = req.body;
  const activationLink = uuid.v4();
  if (!email || !password) {
    return next(new Error("Некорректный email или password"));
  }
  const foundUser = await user.findOne({ where: { email } });
  if (foundUser && foundUser.isActivated) {
    return next(new Error("Такой пользователь существует"));
  }
  try {
    await sendMail(email, activationLink);
  } catch (err) {
    return next(new Error(err.message));
  }
  const encryptedPassword = await bcrypt.hash(password, 5);
  const userElem = await user.upsert({
    name,
    email,
    role,
    password: encryptedPassword,
    activationLink,
  });
  res.json(userElem[0]);
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const userElem = await user.findOne({ where: { email } });
  if (!userElem) {
    return next(new Error("Пользователь не найден"));
  }
  let comparePassword = bcrypt.compareSync(password, userElem.password);
  if (!comparePassword) {
    return next(new Error("Указан неверный пароль"));
  }
  const token = generateJWT(
    userElem.name,
    userElem.id,
    userElem.email,
    userElem.role,
    userElem.phone,
    userElem.img
  );
  res.json({ token });
}

async function activateAccount(req, res, next) {
  try {
    const { link } = req.params;
    const users = await user.findAll({
      attributes: [
        "isActivated",
        [Sequelize.fn("COUNT", Sequelize.col("isActivated")), "count"],
      ],
      group: ["isActivated"],
      order: [["isActivated", "DESC"]],
    });  
    const userElem = await user.update(
      { isActivated: true, role: users.find((roleCount) => roleCount.isActivated === true) ? "USER" : "ADMIN"},
      { where: { activationLink: link }, returning: true }
    );
    res.redirect(process.env.CLIENT_URL);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function check(req, res, next) {
  const token = generateJWT(
    req.user.name,
    req.user.id,
    req.user.email,
    req.user.role,
    req.user.phone,
    req.user.img
  );
  res.json({ token });
}

async function changeProfile(req, res, next) {
  try {
    let fileName = "";
    let { name, oldPassword, newPassword, phone } = req.body;
    const img = req.files && req.files.img;
    if (img) {
      fileName = uuid.v4() + ".png";
      img.mv(
        path.resolve(__dirname, "..", "static", "profile-images", fileName)
      );
    }
    let comparePassword;
    let userElem;
    let encryptedPassword;
    if (oldPassword && newPassword) {
      userElem = await user.findOne({ where: { id: req.user.id } });
      comparePassword = bcrypt.compareSync(oldPassword, userElem.password);
      if (!comparePassword) {
        return next(new Error("Указан неверный пароль!"));
      }
      encryptedPassword = await bcrypt.hash(newPassword, 5);
    }

    const productElem = await user.update(
      {
        img: img ? fileName : Sequelize.literal('"img"'),
        name: name ? name : Sequelize.literal('"name"'),
        phone: phone ? phone : Sequelize.literal('"phone"'),
        password: comparePassword
          ? encryptedPassword
          : Sequelize.literal('"password"'),
      },
      {
        where: {
          id: req.user.id,
        },
        returning: true,
      }
    );
    const token = generateJWT(
      productElem[1][0].name,
      productElem[1][0].id,
      productElem[1][0].email,
      productElem[1][0].role,
      productElem[1][0].phone,
      productElem[1][0].img
    );
    res.json({ token });
  } catch (err) {
    next(new Error(err.message));
  }
}

async function getUserInfo(req, res, next) {
  try {
    const userElem = await user.findOne({
      where: {
        id: req.user.id,
      },
    });

    res.json(userElem);
  } catch (err) {
    next(new Error(err.message));
  }
}

module.exports = {
  registration,
  login,
  activateAccount,
  check,
  changeProfile,
  getUserInfo,
};

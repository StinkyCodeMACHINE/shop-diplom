const bcrypt = require("bcrypt"); //хеширование паролей
const { user, basket } = require("../db/models");
const jwt = require("jsonwebtoken");
const sendMail = require("../service/mail");
const uuid = require("uuid"); // генерирует случайный текст

function generateJWT(name, id, email, role) {
  return jwt.sign(
    {
      id,
      name,
      email,
      role,
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
  res.json(userElem);
  // const basketElem = await basket.create({ userId: userElem.id });
  // const token = generateJWT(userElem.name, userElem.id, userElem.email, userElem.role);

  // res.json({ token });
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
    userElem.role
  );
  res.json({ token });
}

async function activateAccount(req, res, next) {
  try {
    const { link } = req.params;
    const userElem = await user.update(
      { isActivated: true },
      { where: { activationLink: link } }
    );
    await basket.create({ userId: userElem.id });
    res.redirect(process.env.CLIENT_URL);
  } catch (err) {
    next(new Error(err.message));
  }
}

async function check(req, res, next) {
  const token = generateJWT(
    req.user.name,
    req.user.id,
    req.user,
    req.user.role
  );
  res.json({ token });
}

module.exports = {
  registration,
  login,
  activateAccount,
  check,
};

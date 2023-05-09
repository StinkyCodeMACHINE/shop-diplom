const bcrypt = require("bcrypt"); //хеширование паролей
const { user, basket } = require("../db/models");
const jwt = require("jsonwebtoken");

const generateJWT = (id, email, role) => {
  return jwt.sign(
    {
      id,
      email,
      role,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );
};

async function registration(req, res, next) {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return next(new Error("Некорректный email или password"));
  }
  const candidate = await user.findOne({ where: { email } });
  if (candidate) {
    return next(new Error("Такой пользователь существует"));
  }
  const hashPassword = await bcrypt.hash(password, 5);
  const userElem = await user.create({ email, role, password: hashPassword });
  const basketElem = await basket.create({ userId: userElem.id });
  const token = generateJWT(userElem.id, userElem.email, userElem.role);

  res.json({ token });
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
  const token = generateJWT(userElem.id, userElem.email, userElem.role);
  res.json({ token });
}

async function check(req, res, next) {
  const token = generateJWT(req.user.id, req.user, req.user.role);
  res.json({token});
}

module.exports = {
  registration,
  login,
  check,
};

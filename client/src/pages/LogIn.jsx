import react, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../App";
import { login, registration } from "../API/userAPI";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts";

export default function LogIn() {
  const { setUser } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [SignedUp, setSignedUp] = useState(false)

  async function clickHandler(e) {
    try {
      e.preventDefault();
      let data;
      if (isLogin) {
        data = await login(inputValues.email, inputValues.password);
        await setUser({ user: data, isAuth: true });
        navigate(SHOP_ROUTE);
      } else {
        data = await registration(
          inputValues.name,
          inputValues.email,
          inputValues.password
        );
        console.log(data);
        await setInputValues({ email: "", password: "", name: "" });
        await setSignedUp(true);
      }
      // заменить на что-то покруче
    } catch (err) {
      // alert() //заменить на что-то покруче
      console.log(err.message)
    }
  }

  async function inputChangeHandler(e) {
    switch (e.target.type) {
      case "email":
        setInputValues({ ...inputValues, email: e.target.value });
        break;
      case "password":
        setInputValues({ ...inputValues, password: e.target.value });
        break;
      case "text":
        setInputValues({ ...inputValues, name: e.target.value });
        break;
    }
  }

  return (
    <div className="login-form-container">
      <form className="login-form">
        {SignedUp ? (
          <>
            <h2>
              На вашу почту было выслано письмо с потверждением регистрации.
            </h2>
            <button onClick={() => navigate(SHOP_ROUTE)}>Обратно в магазин</button>
          </>
        ) : (
          <>
            <h2>{isLogin ? "Авторизация" : "Регистрация"}</h2>
            {!isLogin && (
              <input
                onChange={inputChangeHandler}
                value={inputValues.name}
                type="text"
                placeholder="Введите ваше имя или фамилию..."
              />
            )}
            <input
              onChange={inputChangeHandler}
              value={inputValues.email}
              type="email"
              placeholder="Введите ваш email..."
            />
            <input
              onChange={inputChangeHandler}
              value={inputValues.password}
              type="password"
              placeholder="Ввведите ваш пароль..."
            />
            <div className="login-form-options">
              {isLogin ? (
                <>
                  <div>
                    Нет аккаунта?{" "}
                    <Link to={REGISTRATION_ROUTE}>Регистрироваться...</Link>
                  </div>
                  <button onClick={clickHandler}>Войти</button>
                </>
              ) : (
                <>
                  <div>
                    Есть аккаунт?{" "}
                    <Link to={LOGIN_ROUTE}>Авторизоваться...</Link>
                  </div>
                  <button onClick={clickHandler}>Зарегистрироваться</button>
                </>
              )}
            </div>
          </>
        )}
      </form>
    </div>
  );
}

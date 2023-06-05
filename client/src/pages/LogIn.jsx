import react, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../App";
import { login, registration } from "../API/userAPI";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts";

export default function LogIn() {
  const { setUser, user } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const [errorPopUp, setErrorPopUp] = useState(false);
  const [areEmpty, setAreEmpty] = useState({
    password: true,
    email: true,
    name: true,
  });
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [SignedUp, setSignedUp] = useState(false);

  useEffect(() => {
    async function apiCalls() {
      const timer = setTimeout(() => setErrorPopUp(false), 1500);

      return () => {
        clearTimeout(timer);
      };
    }

    errorPopUp && apiCalls();
  }, [errorPopUp]);

  async function clickHandler(e) {
    if (
      (isLogin && !areEmpty.email && !areEmpty.password) ||
      (!isLogin && !areEmpty.email && !areEmpty.password && !areEmpty.name)
    )
    {
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
          await setInputValues({ email: "", password: "", name: "" });
          await setSignedUp(true);
        }
      } catch (err) {
        setErrorPopUp(true);
      }
    }
      
  }

  async function inputChangeHandler(e) {
    switch (e.target.type) {
      case "email":
        await setInputValues({ ...inputValues, email: e.target.value });
        if (e.target.value) {
          await setAreEmpty(oldAreEmpty => ({...oldAreEmpty, email: false}))
        }
        else {
          await setAreEmpty((oldAreEmpty) => ({
            ...oldAreEmpty,
            email: true,
          }));
        }
        break;
      case "password":
        await setInputValues({ ...inputValues, password: e.target.value });
        if (e.target.value) {
          await setAreEmpty((oldAreEmpty) => ({
            ...oldAreEmpty,
            password: false,
          }));
        } else {
          await setAreEmpty((oldAreEmpty) => ({
            ...oldAreEmpty,
            password: true,
          }));
        }
        break;
      case "text":
        await setInputValues({ ...inputValues, name: e.target.value });
        if (e.target.value) {
          await setAreEmpty((oldAreEmpty) => ({
            ...oldAreEmpty,
            name: false,
          }));
        } else {
          await setAreEmpty((oldAreEmpty) => ({
            ...oldAreEmpty,
            name: true,
          }));
        }
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

            <div
              onClick={() => navigate(SHOP_ROUTE)}
              className="product-option-container"
            >
              <div>Обратно в магазин</div>
            </div>
          </>
        ) : (
          <>
            <h2>{isLogin ? "Авторизация" : "Регистрация"}</h2>
            {!isLogin && (
              <input
                style={
                  areEmpty.name
                    ? { outline: "1px solid var(--cred)" }
                    : { }
                }
                onChange={inputChangeHandler}
                value={inputValues.name}
                type="text"
                placeholder="Введите ваше имя или фамилию..."
              />
            )}
            <input
              style={
                areEmpty.email
                  ? { outline: "1px solid var(--cred)" }
                  : { }
              }
              onChange={inputChangeHandler}
              value={inputValues.email}
              type="email"
              placeholder="Введите ваш email..."
            />
            <input
              style={
                areEmpty.password
                  ? { outline: "1px solid var(--cred)" }
                  : { }
              }
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
                  <div
                    onClick={clickHandler}
                    className="product-option-container"
                  >
                    <div>Войти</div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    Есть аккаунт?{" "}
                    <Link to={LOGIN_ROUTE}>Авторизоваться...</Link>
                  </div>
                  <div
                    onClick={clickHandler}
                    className="product-option-container"
                  >
                    <div>Зарегистрироваться</div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </form>
      <div
        style={errorPopUp ? { opacity: "1" } : { opacity: "0" }}
        id="error-pop-up"
      >
        Неверно введены данные
      </div>
    </div>
  );
}

import react, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../index";
import { ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from "../utils/consts";
import {observer} from 'mobx-react-lite'

export default observer (function Navbar() {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  function logOut() {
    user.setIsAuth(false);
    localStorage.removeItem("token")
    user.setUser({})
    navigate(SHOP_ROUTE)
  }

  return (
    <div className="navbar">
      <Link to={SHOP_ROUTE}>КупиДевайс</Link>
      {user.isAuth ? (
        <div className="navbar-options">
          <div onClick={() => navigate(ADMIN_ROUTE)}>Админ</div>
          <img src="/assets/cart.svg" />
          <div onClick={logOut}>Выйти</div>
        </div>
      ) : (
        <div className="navbar-options">
          <div onClick={() => navigate(LOGIN_ROUTE)}>Авторизоваться</div>
        </div>
      )}
    </div>
  );
})
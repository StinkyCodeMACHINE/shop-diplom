import react, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { Context } from "../App";

export default function Navbar() {
  const { user, setUser } = useContext(Context);
  const navigate = useNavigate();

  function logOut() {
    setUser({ user: {}, isAuth: false });
    localStorage.removeItem("token");
    navigate(SHOP_ROUTE);
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
};

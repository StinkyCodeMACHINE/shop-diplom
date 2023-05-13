import react, { useEffect, useState, createContext, useContext } from "react";
import Navbar from "./components/Navbar";
import { check } from "./API/userAPI";
import { Routes, Route, Navigate } from "react-router-dom";
import { adminRoutes, authRoutes, publicRoutes } from "./utils/routes";
import { SHOP_ROUTE } from "./utils/consts";

export const Context = createContext(null);

export default function App() {
  const [user, setUser] = useState({ user: {}, isAuth: false });
  const [product, setProduct] = useState({
    types: [],
    brands: [],
    products: [],
    selectedType: {},
    selectedBrand: {},

    name: "",
    page: 1,
    totalCount: 0,
    limit: 3,
  });
  const [whatIsShown, setWhatIsShown] = useState("");

  console.log(
    `user: ${user.user.email} | role: ${user.user.role} | isAuth: ${user.isAuth}`
  );

  useEffect(() => {
    check().then((data) => {
      setUser({ user: data, isAuth: true });
    });
  }, []);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        product,
        setProduct,
        whatIsShown,
        setWhatIsShown,
      }}
    >
      <div>
        <Navbar />
        <Routes>
          {user.isAuth &&
            authRoutes.map((route) => {
              const { path, element } = route;
              return <Route key={path} path={path} element={element} />;
            })}
          {user.user.role === "ADMIN" &&
            adminRoutes.map((route) => {
              const { path, element } = route;
              return <Route key={path} path={path} element={element} />;
            })}
          {publicRoutes.map((route) => {
            const { path, element } = route;
            return <Route key={path} path={path} element={element} />;
          })}

          <Route path="*" element={<Navigate to={SHOP_ROUTE} />} />
        </Routes>
      </div>
    </Context.Provider>
  );
}

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
    groups: [],
    types: [],
    brands: [],
    favourite: [],
    products: [],
    selectedGroup: {},
    selectedType: {},
    selectedBrand: {},
    sortingValue: { value: { byWhat: "", order: "DESC" }, text: "Отсутствует" },
    name: "",
    page: 1,
    totalCount: 0,
    limit: 5,
    toCompare: []
  });
  const [whatIsShown, setWhatIsShown] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  console.log(
    `user: ${user.user.email} | role: ${user.user.role} | isAuth: ${user.isAuth}`
  );

  useEffect(() => {
    async function apiCalls() {
      try {
        const data = await check()
        await setUser({ user: data, isAuth: true });
      }
      catch (err) {

      }
      finally {
        await setAuthChecked(true);
      }
    }
    apiCalls()
  }, []);

  return (
    <>
      {authChecked && (
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
      )}
    </>
  );
}

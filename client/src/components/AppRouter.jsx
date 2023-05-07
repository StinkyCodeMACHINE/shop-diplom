import react, { useContext } from "react";
import {Routes, Route, Navigate} from "react-router-dom" 
import { authRoutes, publicRoutes } from "../utils/routes";
import DevicePage from "../pages/DevicePage";
import {SHOP_ROUTE} from '../utils/consts'
import {Context} from '../index'
import { observer } from "mobx-react-lite";

export default observer( function AppRouter() {
  const {user} = useContext(Context)

  return (
    <Routes>
      {user.isAuth &&
        authRoutes.map((route) => {
          const { path, element } = route;
          return <Route key={path} path={path} element={element} exact />;
        })}
      {publicRoutes.map((route) => {
        const { path, element } = route;
        return <Route key={path} path={path} element={element} exact />;
      })}

      <Route path="*" element={<Navigate to={SHOP_ROUTE} />} />
    </Routes>
  );
})

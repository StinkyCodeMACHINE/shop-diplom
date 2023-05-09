import react, { useEffect, useState, useContext } from "react";
import Navbar from './components/Navbar'
import {observer} from 'mobx-react-lite'
import {check} from './API/userAPI'
import {Context} from '../src/index'
import { Routes, Route, Navigate } from "react-router-dom";
import { authRoutes, publicRoutes } from "./utils/routes";
import { SHOP_ROUTE } from "./utils/consts";


export default observer(function App() {
  const {user} = useContext(Context)

  useEffect(() => {
    check().then(data => {
      user.setIsAuth(true)
    })

  }, [])

  return (
    <div>
      <Navbar />
      <Routes>
        {user.isAuth &&
          authRoutes.map((route) => {
            const { path, element } = route;
            return <Route key={path} path={path} element={element}  />;
          })}
        {publicRoutes.map((route) => {
          const { path, element } = route;
          return <Route key={path} path={path} element={element}  />;
        })}

        <Route path="*" element={<Navigate to={SHOP_ROUTE} />} />
      </Routes>
    </div>
  );

})
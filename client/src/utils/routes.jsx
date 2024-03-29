import AdminPanel from "../pages/AdminPanel";
import LogIn from "../pages/LogIn";
import Basket from "../pages/Basket";
import ProductPage from "../pages/ProductPage";
import Shop from "../pages/Shop";
import Favourite from "../pages/Favourite"
import Compare from "../pages/Compare";
import Orders from "../pages/Orders"
import Profile from "../pages/Profile"
import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  PRODUCT_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
  FAVOURITE_ROUTE,
  COMPARE_ROUTE,
  ORDERS_ROUTE,
  PROFILE_ROUTE,
  GROUP_TYPES_ROUTE,
  MAIN_PAGE_ROUTE,
} from "./consts";
import GroupTypes from "../pages/GroupTypes";
import MainPage from "../pages/MainPage";



export const adminRoutes = [
  {
    path: ADMIN_ROUTE,
    element: <AdminPanel />,
  },
];
export const authRoutes = [
  {
    path: BASKET_ROUTE,
    element: <Basket />,
  },
  {
    path: FAVOURITE_ROUTE,
    element: <Favourite />,
  },
  {
    path: COMPARE_ROUTE,
    element: <Compare />,
  },
  {
    path: ORDERS_ROUTE,
    element: <Orders />,
  },
  {
    path: PROFILE_ROUTE,
    element: <Profile />,
  },
  
];

export const publicRoutes = [
  {
    path: SHOP_ROUTE,
    element: <Shop />,
  },
  {
    path: LOGIN_ROUTE,
    element: <LogIn />,
  },
  {
    path: REGISTRATION_ROUTE,
    element: <LogIn />,
  },
  {
    path: PRODUCT_ROUTE + "/:id",
    element: <ProductPage />,
  },
  {
    path: GROUP_TYPES_ROUTE + "/:id",
    element: <GroupTypes />,
  },
  {
    path: MAIN_PAGE_ROUTE,
    element: <MainPage />,
  },
];

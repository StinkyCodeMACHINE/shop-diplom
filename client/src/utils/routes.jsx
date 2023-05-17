import AdminPanel from "../pages/AdminPanel";
import LogIn from "../pages/LogIn";
import Basket from "../pages/Basket";
import ProductPage from "../pages/ProductPage";
import Shop from "../pages/Shop";
import Favourite from "../pages/Favourite"
import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  PRODUCT_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
  FAVOURITE_ROUTE,
} from "./consts";


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
    element: <Favourite />
  }
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
];

export const ADMIN_ROUTE = "/admin-panel";
export const LOGIN_ROUTE = "/login";
export const REGISTRATION_ROUTE = "/registration";
export const SHOP_ROUTE = "/shop";
export const BASKET_ROUTE = "/basket";
export const PRODUCT_ROUTE = "/product-page";
export const FAVOURITE_ROUTE = "/favourite-page";

export const API_URL = "http://localhost:7000/";
export const PRODUCT_IMAGE_URL = "product-images/";
export const PROFILE_IMAGE_URL = "profile-images/";

export const productSortingValues = [
  { value: { byWhat: "", order: "DESC" }, text: "Отсутствует" },
  { value: { byWhat: "price", order: "ASC" }, text: "Сначала недорогие" },
  { value: { byWhat: "price", order: "DESC" }, text: "Сначала дорогие" },
  // { value: {byWhat: "", order: "DESC"}, text: "Сначала популярные" },
  { value: { byWhat: "discount", order: "DESC" }, text: "По скидке" },
  // { value: {byWhat: "", order: "DESC"}, text: "Сначала обсуждаемые" },
  {
    value: { byWhat: "rating", order: "DESC" },
    text: "Сначала с лучшей оценкой",
  },
];

export const productLimitValues = [
  { value: 5 },
  { value: 10 },
  { value: 15 },
  { value: 20 },
];

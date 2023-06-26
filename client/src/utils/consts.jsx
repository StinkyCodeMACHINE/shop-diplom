export const ADMIN_ROUTE = "/admin-panel";
export const LOGIN_ROUTE = "/login";
export const REGISTRATION_ROUTE = "/registration";
export const SHOP_ROUTE = "/shop";
export const BASKET_ROUTE = "/basket";
export const PRODUCT_ROUTE = "/product-page";
export const FAVOURITE_ROUTE = "/favourite-page";
export const COMPARE_ROUTE = "/compare";
export const ORDERS_ROUTE = "/orders"
export const PROFILE_ROUTE = "/profile"
export const GROUP_TYPES_ROUTE = "/group-types"
export const MAIN_PAGE_ROUTE = "/main-page"

export const API_URL = "http://localhost:7000/";
export const PRODUCT_IMAGE_URL = "product-images/";
export const BRAND_IMAGE_URL = "brand-images/";
export const GROUP_IMAGE_URL = "group-images/";
export const TYPE_IMAGE_URL = "type-images/";
export const PROFILE_IMAGE_URL = "profile-images/";
export const BANNER_IMAGE_URL = "banner-images/";


export const productSortingValues = [
  { value: { byWhat: ""}, text: "Отсутствует" },
  { value: { byWhat: "price", order: "ASC" }, text: "Сначала недорогие" },
  { value: { byWhat: "price", order: "DESC" }, text: "Сначала дорогие" },
  { value: {byWhat: "isHyped", order: "DESC"}, text: "Сначала самые популярные" },
  { value: { byWhat: "discount", order: "ASC" }, text: "По размеру скидки" },
  // { value: {byWhat: "", order: "DESC"}, text: "Сначала обсуждаемые" },
  {
    value: { byWhat: "rating", order: "DESC" },
    text: "Сначала с лучшей оценкой",
  },
];

export const reviewSortingValues = [
  { value: { byWhat: ""}, text: "Отсутствует" },
  { value: { byWhat: "diff", order: "DESC" }, text: "Сначала самые полезные" },
  { value: { byWhat: "diff", order: "ASC" }, text: "Сначала самые плохие" },
];

export const reviewLimitValues = [
  { value: 5 },
  { value: 10 },
  { value: 15 },
  { value: 20 },
];

export const productLimitValues = [
  { value: 5 },
  { value: 10 },
  { value: 15 },
  { value: 20 },
];


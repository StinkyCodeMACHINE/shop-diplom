import { axiosAuthReq, axiosReq } from "./axiosStuff";

export async function createType(type) {
  const { data } = await axiosAuthReq.post("/api/type", type);
  return data;
}

export async function getTypes() {
  const { data } = await axiosReq.get("/api/type");
  return data;
}

export async function getDefaultTypeInfo(id) {
  const { data } = await axiosReq.get(`/api/type/${id}`);
  return data;
}

export async function createGroup(group) {
  const { data } = await axiosAuthReq.post("/api/group", group);
  return data;
}

export async function getGroups() {
  const { data } = await axiosReq.get("/api/group");
  return data;
}

export async function createBrand(brand) {
  const { data } = await axiosAuthReq.post("/api/brand", brand);
  return data;
}

export async function getBrands() {
  const { data } = await axiosReq.get("/api/brand");
  return data;
}

export async function createProduct(product) {
  const { data } = await axiosAuthReq.post("/api/product", product);
  return data;
}

export async function getProducts({
  typeId,
  brandId,
  page,
  limit,
  name,
  sorting,
  priceRange,
  selectedInfoInstance,
  inStock,
}) {
  const { data } = await axiosReq.get("/api/product", {
    params: {
      typeId,
      brandId,
      page,
      limit,
      name,
      sorting,
      priceRange,
      selectedInfoInstance,
      inStock,
    },
  });
  return data;
}

export async function getProductsSearch({ limit, name, typeId }) {
  const { data } = await axiosReq.get("/api/product", {
    params: { limit, name, typeId },
  });
  return data;
}

export async function getOneProduct(id) {
  const { data } = await axiosReq.get(`/api/product/${id}`);
  return data;
}

export async function leaveReview({
  id,
  advantages,
  disadvantages,
  text,
  rating,
  reviewCount
}) {
  const { data } = await axiosAuthReq.post(`/api/product/${id}/review`, {
    advantages,
    disadvantages,
    text,
    rating,
    reviewCount
  });
  return data;
}

export async function getReviews({id, page, limit, sorting}) {
  const { data } = await axiosReq.get(`/api/product/${id}/review`, {
    params: {
      page,
      limit,
      sorting,
    },
  });
  return data;
}

export async function rateReview({ id, reviewId, liked }) {
  const { data } = await axiosAuthReq.post(
    `/api/product/${id}/review/rate/${reviewId}`,
    {
      liked,
    }
  );
  return data;
}

export async function getReviewRatings({ id }) {
  const { data } = await axiosAuthReq.get(`/api/product/${id}/review/rate`);
  return data;
}

export async function deleteReviewRating({ id, reviewId }) {
  const { data } = await axiosAuthReq.delete(
    `/api/product/${id}/review/rate/${reviewId}`
  );
  return data;
}



export async function getReview(id) {
  const { data } = await axiosAuthReq.get(`/api/product/${id}/review/check`);
  return data;
}

export async function countReviews(id) {
  const { data } = await axiosReq.get(`/api/product/${id}/review/count`);
  return data;
}

export async function addToFavourite(id) {
  const { data } = await axiosAuthReq.post(`/api/favourite/product/${id}`, {
    productId: id,
  });
  return data;
}

export async function removeFromFavourite(id) {
  const { data } = await axiosAuthReq.delete(`/api/favourite/product/${id}`);
  return data;
}

export async function getFavouriteIds() {
  console.log(`token from shit: ${localStorage.getItem("token")}`);
  const { data } = await axiosAuthReq.get(`/api/favourite/`);
  return data;
}

export async function getFavouriteProducts(page, limit) {
  const { data } = await axiosAuthReq.get(`/api/favourite/product/`, {
    params: {
      limit,
      page,
    },
  });
  return data;
}

export async function getInstances(keyId) {
  const { data } = await axiosReq.get(`/api/info/${keyId}/`);
  return data;
}

export async function createOrder({cart, phone, email, name, address}) {
  const { data } = await axiosAuthReq.post(`/api/order/`, {
    cart,
    phone,
    email,
    name,
    address,
  });
  return data;
}

export async function getOrders() {
  const { data } = await axiosAuthReq.get(`/api/order/`);
  return data;
}

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

export async function createProduct(device) {
  const { data } = await axiosAuthReq.post("/api/product", device);
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

export async function addToFavourite(id, userId) {
  const { data } = await axiosAuthReq.post(`/api/favourite/product/${id}`, {
    productId: id,
    userId,
  });
  return data;
}

export async function removeFromFavourite(id) {
  const { data } = await axiosAuthReq.delete(`/api/favourite/product/${id}`);
  return data;
}

export async function getFavouriteIds(userId) {
  console.log(`token from shit: ${localStorage.getItem("token")}`);
  const { data } = await axiosAuthReq.get(`/api/favourite/`, {
    params: {
      userId,
    },
  });
  return data;
}

export async function getFavouriteProducts(page, limit, userId) {
  const { data } = await axiosAuthReq.get(`/api/favourite/product/`, {
    params: {
      userId,
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

import { $authHost, $host } from "./axiosStuff";

export async function createType(type) {
  const { data } = await $authHost.post("/api/type", type);
  return data;
}

export async function getTypes() {
  const { data } = await $host.get("/api/type");
  return data;
}

export async function createBrand(brand) {
  const { data } = await $authHost.post("/api/brand", brand);
  return data;
}

export async function getBrands() {
  const { data } = await $host.get("/api/brand");
  return data;
}

export async function createProduct(device) {
  const { data } = await $authHost.post("/api/product", device);
  return data;
}

export async function getProducts(typeId, brandId, page, limit, name) {
  const { data } = await $host.get("/api/product", {
    params: { typeId, brandId, page, limit, name },
  });
  return data;
}

export async function getProductsSearch(limit, name, typeId) {
  const { data } = await $host.get("/api/product", {
    params: { limit, name, typeId },
  });
  return data;
}

export async function getOneProduct(id) {
  const { data } = await $host.get(`/api/product/${id}`);
  return data;
}

export async function addToFavourite(id, userId) {
  const { data } = await $authHost.post(`/api/favourite/product/${id}`, {
    productId: id,
    userId,
  });
  return data;
}

export async function removeFromFavourite(id) {
  const { data } = await $authHost.delete(`/api/favourite/product/${id}`);
  return data;
}

export async function getFavouriteId(id, userId) {
  console.log("userId: " + userId)
  const { data } = await $authHost.get(`/api/favourite/${id}`, {
    params: {
      userId
    },
  });
  return data;
}

export async function getFavouriteProducts(page, limit, userId) {
  const { data } = await $authHost.get(`/api/favourite/product/`, {
    params: {
      userId,
      limit,
      page,
    },
  });
  return data;
}


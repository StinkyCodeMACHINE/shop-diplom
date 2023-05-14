import react, { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";
import { API_URL, PRODUCT_ROUTE, PRODUCT_IMAGE_URL } from "../utils/consts";
import {
  getBrands,
  getFavouriteIds,
  getProducts,
  getTypes,
  getFavouriteProducts
} from "../API/productAPI";
import Pagination from "../components/Favourite/Pagination";
import ProductCard from "../components/Favourite/ProductCard";

export default function Favourite() {
  const { product, setProduct, user } = useContext(Context);

  useEffect(() => {
    async function apiCalls() {
      const result = {};
      result.types = await getTypes();
      result.brands = await getBrands();
      result.favourite = user.user.id ? await getFavouriteIds(user.user.id) : [];
      await setProduct((oldProduct) => ({
        ...oldProduct,
        types: result.types,
        brands: result.brands,
        favourite: result.favourite,
      }));
    }

    apiCalls();

    console.log("1 useeffect бренды типы и фавориты");
  }, [user.user.id]);

  //изменение пагинации
  useEffect(() => {
    async function apiCalls() {
      let data = await getFavouriteProducts(product.page, 3, user.user.id);
      await setProduct((oldProduct) => ({
        ...oldProduct,
        products: data.rows,
        totalCount: data.count,
      }));
    }

    apiCalls();

    console.log("2 useeffect селбренды селтипы и пейдж и имя");
  }, [product.page, product.favourite]);

  useEffect(() => {
    async function apiCalls() {
      let data = await getFavouriteProducts(1, 3, user.user.id);
      await setProduct((oldProduct) => ({
        ...oldProduct,
        products: data.rows,
        totalCount: data.count,
        page: 1,
      }));
    }

    apiCalls();

    console.log("3 useeffect селбренды селтипы");
  }, []);

  return (
    <div className="favourite-container">
      <div className="favourite-inner-container">
        <h2>Избранное</h2>
        {product.types.length > 0 && (
          <div className="product-cards">
            {product.products.map((eachProduct) => (
              <ProductCard
                key={eachProduct.id}
                id={eachProduct.id}
                typeId={eachProduct.typeId}
                brandId={eachProduct.brandId}
                img={eachProduct.img}
                rating={eachProduct.rating}
                name={eachProduct.name}
              />
            ))}
          </div>
        )}

        <Pagination />
      </div>
    </div>
  );
}

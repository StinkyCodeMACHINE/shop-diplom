import react, { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";
import { API_URL, PRODUCT_ROUTE, PRODUCT_IMAGE_URL } from "../utils/consts";
import {
  getBrands,
  getFavouriteIds,
  getProducts,
  getTypes,
} from "../API/productAPI";
import Pagination from "../components/Shop/Pagination";
import ProductCard from "../components/Shop/ProductCard";

export default function Shop() {
  const { product, setProduct, user } = useContext(Context);
  const [renderedOnce, setRenderedOnce] = useState(false)

  useEffect(() => {
    async function apiCalls() {
      const result = {};
      result.types = await getTypes();
      result.brands = await getBrands();
      result.favourite = user.user.id
        ? await getFavouriteIds(user.user.id)
        : [];
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
      let data = await getProducts(
        product.selectedType.id,
        product.selectedBrand.id,
        product.page,
        3,
        product.name
      );
      await setProduct((oldProduct) => ({
        ...oldProduct,
        products: data.rows,
        totalCount: data.count,
      }));
    }

    apiCalls();
    

    console.log("2 useeffect селбренды селтипы и пейдж и имя");
  }, [product.page]);

  useEffect(() => {
    async function apiCalls() {
      let data = await getProducts(
        product.selectedType.id,
        product.selectedBrand.id,
        1,
        3,
        product.name
      );
      await setProduct((oldProduct) => ({
        ...oldProduct,
        products: data.rows,
        totalCount: data.count,
        page: 1,
      }));
    }
    renderedOnce && apiCalls()
    setRenderedOnce(true)

    console.log("3 useeffect селбренды селтипы");
  }, [product.selectedBrand, product.selectedType, product.name]);

  return (
    <div className="shop-container">
      <div className="types">
        {product.types.map((eachType) => (
          <div
            key={eachType.id}
            style={
              eachType.id === product.selectedType.id ? { color: "blue" } : {}
            }
            onClick={() =>
              product.selectedType.id === eachType.id
                ? setProduct((oldProduct) => ({
                    ...oldProduct,
                    selectedType: {},
                  }))
                : setProduct((oldProduct) => ({
                    ...oldProduct,
                    selectedType: eachType,
                  }))
            }
          >
            {eachType.name}
          </div>
        ))}
      </div>
      <div className="main-container">
        <div className="brands">
          {product.brands.map((eachBrand) => (
            <div
              key={eachBrand.id}
              style={
                eachBrand.id === product.selectedBrand.id
                  ? { color: "blue" }
                  : {}
              }
              onClick={() =>
                product.selectedBrand.id === eachBrand.id
                  ? setProduct((oldProduct) => ({
                      ...oldProduct,
                      selectedBrand: {},
                    }))
                  : setProduct((oldProduct) => ({
                      ...oldProduct,
                      selectedBrand: eachBrand,
                    }))
              }
            >
              {eachBrand.name}
            </div>
          ))}
        </div>
        {(product.types.length > 0 && product.brands.length > 0 ) && (
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

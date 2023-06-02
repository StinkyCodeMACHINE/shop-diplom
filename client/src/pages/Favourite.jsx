import react, { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";
import {
  API_URL,
  PRODUCT_ROUTE,
  PRODUCT_IMAGE_URL,
  productLimitValues,
} from "../utils/consts";
import {
  getBrands,
  getFavouriteIds,
  getTypes,
  getFavouriteProducts,
} from "../API/productAPI";
import Pagination from "../components/Favourite/Pagination";
import ProductCard from "../components/Shop/ProductCard";

export default function Favourite() {
  const { product, setProduct, user, whatIsShown, setWhatIsShown } =
    useContext(Context);
  const [renderedOnce, setRenderedOnce] = useState(false);

  useEffect(() => {
    async function apiCalls() {
      const result = {};
      result.types = await getTypes();
      result.brands = await getBrands();
      result.favourite = user.user.id
        ? await getFavouriteIds()
        : [];
      await setProduct((oldProduct) => ({
        ...oldProduct,
        types: result.types,
        brands: result.brands,
        favourite: result.favourite,
      }));

      setRenderedOnce(true);
    }

    apiCalls();

    console.log("1 useeffect бренды типы и фавориты");
  }, [user.user.id]);

  //изменение пагинации
  useEffect(() => {
    async function apiCalls() {
      let data = await getFavouriteProducts(
        product.page,
        product.limit,
        user.user.id
      );
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
      let data = await getFavouriteProducts(1, product.limit);
      await setProduct((oldProduct) => ({
        ...oldProduct,
        products: data.rows,
        totalCount: data.count,
        page: 1,
      }));
    }

    apiCalls();

    console.log("3 useeffect селбренды селтипы");
  }, [product.limit]);

  console.log("fav brands: " + product.brands);

  return (
    renderedOnce && (
      <div className="favourite-container">
        <div className="favourite-inner-container">
          <div className="shop-main-container-top-options">
            <h2>Избранное</h2>
            <div className="shop-main-container-top-option-container">
              <div
                onClick={() =>
                  whatIsShown !== "limit"
                    ? setWhatIsShown("limit")
                    : setWhatIsShown("")
                }
              >
                Показывать: <span>{product.limit}</span>
              </div>
              <img
                style={
                  whatIsShown !== "limit"
                    ? { transform: "rotate(-270deg)" }
                    : { transform: "rotate(-90deg)" }
                }
                src="/assets/drop-down-arrow.svg"
                className="navbar-types-icon"
              />
              {whatIsShown === "limit" && (
                <div className="shop-main-container-top-sorting-options">
                  {productLimitValues.map((elem) => (
                    <div
                      key={elem.value}
                      onClick={() => {
                        setWhatIsShown("");
                        setProduct((oldProduct) => ({
                          ...oldProduct,
                          limit: elem.value,
                        }));
                      }}
                    >
                      {elem.value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
                  price={eachProduct.price}
                  discount={eachProduct.discount}
                  isHyped={eachProduct.isHyped}
                  left={eachProduct.left}
                />
              ))}
            </div>
          )}

          <Pagination />
        </div>
      </div>
    )
  );
}

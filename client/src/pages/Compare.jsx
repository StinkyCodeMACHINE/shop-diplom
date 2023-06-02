import react, { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import {
  API_URL,
  PRODUCT_ROUTE,
  PRODUCT_IMAGE_URL,
  productLimitValues,
} from "../utils/consts";
import {
  getBrands,
  getTypes,
  getOneProduct,
  getFavouriteIds,
  addToFavourite,
  removeFromFavourite,
} from "../API/productAPI";
import Pagination from "../components/Favourite/Pagination";
import ProductCard from "../components/Favourite/ProductCard";

export default function Compare() {
  //31 33
  const { product, setProduct, user } = useContext(Context);
  const navigate = useNavigate();

  const [renderedOnce, setRenderedOnce] = useState(false);
  const [products, setProducts] = useState([]);
  const [statsInCommon, setStatsInCommon] = useState([]);

  //запись категорий брендов и избранного
  useEffect(() => {
    console.log("ass1");
    async function apiCalls() {
      const types = await getTypes();
      const brands = await getBrands();
      const favourite = await getFavouriteIds();
      await setProduct((oldProduct) => ({
        ...oldProduct,
        types,
        brands,
        favourite,
      }));

      const productsArray = [];

      for (let i = 0; i < product.toCompare.length; i++) {
        const oneProduct = await getOneProduct(product.toCompare[i]);
        productsArray.push({ ...oneProduct, isHoveredOver: false });
      }

      await setProducts(productsArray);

      let statsInCommonArray = [];
      if (product.toCompare.length === 2) {
        statsInCommonArray = productsArray[0].info.flatMap((stat) => {
          const foundStat = productsArray[1].info.find(
            (otherStat) => otherStat.key === stat.key
          );
          if (foundStat) {
            return { ...stat, value2: foundStat.value };
          } else {
            return [];
          }
        });
      }
      await setStatsInCommon(statsInCommonArray);
    }

    product.toCompare.length > 0 && apiCalls();
    setRenderedOnce(true);
  }, [product.toCompare]);

//   //для теста 
//   useEffect(() => {
//     console.log("ass1");
//     async function apiCalls() {
//       await setProduct((oldProduct) => ({ ...oldProduct, toCompare: [31, 33] }));
//     }

//     apiCalls();
//   }, []);

  return (
    <div className="compare-page-main-container">
      <h1>Сравнение</h1>
      {products.length === 0 ? (
        <div>Ничего нет!</div>
      ) : (
        <div>
          <button
            onClick={async () => {
              await setProduct((oldProduct) => ({
                ...oldProduct,
                toCompare: [],
              }));
              await setProducts([]);
            }}
          >
            Отчистить сравнение
          </button>
          <div className="compare-page-products-container">
            {products.map((productElem) => (
              <div
                key={productElem.id}
                className="compare-page-product-card-container"
              >
                <img
                  style={{  height: "300px",
  width: '100%'}}
                  onClick={() => navigate(PRODUCT_ROUTE + "/" + productElem.id)}
                  src={API_URL + PRODUCT_IMAGE_URL + productElem.img[0]}
                />
                <div className="type-and-rating">
                  <div className="type-brand">
                    {product.types.find(
                      (type) => type.id === productElem.typeId
                    ).name +
                      " " +
                      product.brands.find(
                        (brand) => brand.id === productElem.brandId
                      ).name}
                  </div>
                  <div className="rating">
                    {productElem.rating > 0 ? (
                      <>
                        <div>{productElem.rating}</div>
                        <img src="/assets/fratingstar.png" />
                      </>
                    ) : (
                      <>
                        <div>Нет отзывов</div>
                        <img src="/assets/eratingstar.png" />
                      </>
                    )}
                  </div>
                </div>
                <div
                  onClick={() => navigate(PRODUCT_ROUTE + "/" + productElem.id)}
                  className="product-name"
                >
                  {productElem.name}
                </div>
                <div
                  onClick={() => navigate(PRODUCT_ROUTE + "/" + productElem.id)}
                  className="product-name"
                >
                  {productElem.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                  &#x20BD;
                </div>
                {user.isAuth && (
                  <>
                    <div
                      onClick={async () => {
                        if (
                          product.favourite.find(
                            (elem) => elem.productId === productElem.id
                          )
                        ) {
                          await removeFromFavourite(productElem.id);
                        } else {
                          await addToFavourite(productElem.id);
                        }
                        let favourite = await getFavouriteIds();
                        await setProduct((oldProduct) => ({
                          ...oldProduct,
                          favourite: [...favourite],
                        }));
                      }}
                      onMouseOver={async () => {
                        setProducts((oldProducts) =>
                          oldProducts.map((oldProductElem) =>
                            oldProductElem.id === productElem.id
                              ? { ...oldProductElem, isHoveredOver: true }
                              : oldProductElem
                          )
                        );
                      }}
                      onMouseLeave={async () => {
                        setProducts((oldProducts) =>
                          oldProducts.map((oldProductElem) =>
                            oldProductElem.id === productElem.id
                              ? {
                                  ...oldProductElem,
                                  isHoveredOver: false,
                                }
                              : oldProductElem
                          )
                        );
                      }}
                      className="product-heart-container"
                    >
                      <div className="product-heart-icon-container">
                        <img
                          className="product-heart product-heart-empty"
                          src="/assets/eheart.svg"
                        />
                        <img
                          className="product-heart product-heart-full"
                          style={
                            product.favourite.find(
                              (elem) => elem.productId === productElem.id
                            )
                              ? productElem.isHoveredOver
                                ? {
                                    opacity: 0,
                                    transition: "600ms opacity ease-in",
                                  }
                                : { opacity: 1 }
                              : productElem.isHoveredOver
                              ? {
                                  opacity: 1,
                                  transition: "600ms opacity ease-in",
                                }
                              : {}
                          }
                          src="/assets/fheart.svg"
                        />
                      </div>

                      <div className="product-heart-text">
                        Добавить в избранное
                      </div>
                    </div>
                    <div></div>
                  </>
                )}
              </div>
            ))}
          </div>
          <h2>Описание</h2>
          <div className="compare-page-description-container">
            {products.length === 1 ? (
              <p className="product-page-description">
                {products[0].description}
              </p>
            ) : (
              products.map((product) => (
                <p className="product-page-description">
                  {product.description}
                </p>
              ))
            )}
          </div>
          <h2>Характеристики</h2>
          {statsInCommon.length === 0 && (
            <h3>У товаров нет общих характеристик</h3>
          )}

          <div className="compare-page-stats-container">
            {products.length === 1
              ? products[0].info.map((statElem) => (
                  <div>
                    <div className="compare-page-stats">
                      <div
                        key={nanoid()}
                        style={
                          statElem.id % 2 === 1
                            ? { backgroundColor: "white" }
                            : {}
                        }
                        className="compare-page-stat"
                      >
                        {statElem.key}: {statElem.value}
                      </div>
                    </div>
                  </div>
                ))
              : statsInCommon.map((statElem) => (
                  <div>
                    <div className="compare-page-stats">
                      <div
                        key={nanoid()}
                        style={
                          statElem.id % 2 === 1
                            ? { backgroundColor: "white" }
                            : {}
                        }
                        className="compare-page-stat"
                      >
                        {statElem.key}: {statElem.value}
                      </div>
                      <div
                        key={nanoid()}
                        style={
                          statElem.id % 2 === 1
                            ? { backgroundColor: "white" }
                            : {}
                        }
                        className="compare-page-stat"
                      >
                        {statElem.key}: {statElem.value2}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}

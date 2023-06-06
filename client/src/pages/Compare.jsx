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

    apiCalls();
    setRenderedOnce(true);
  }, [product.toCompare]);

  return (
    <div className="compare-page-main-container">
      <h1>Сравнение</h1>
      {products.length === 0 ? (
        <h2>Ничего не было найдено</h2>
      ) : (
        <div className="compare-page-inner-container">
          {/* <button
            onClick={async () => {
              await setProduct((oldProduct) => ({
                ...oldProduct,
                toCompare: [],
              }));
              await setProducts([]);
            }}
          >
            Отчистить сравнение
          </button> */}

          <div
            onClick={async () => {
              await setProduct((oldProduct) => ({
                ...oldProduct,
                toCompare: [],
              }));
              await setProducts([]);
            }}
            className="product-option-container"
          >
            <img
              style={{
                width: "30px",
                height: "30px",
                filter: "var(--cred-filter)",
              }}
              className="compare-icon"
              src="/assets/delete.png"
            />
            <div>Отчистить сравнение</div>
          </div>

          <div>
            <div className="compare-page-products-container">
              {products.map((productElem) => (
                <div
                  key={productElem.id}
                  className="compare-page-product-card-container"
                >
                  <div className="product-page-img-container">
                    <img
                      style={{ height: "300px", width: "100%" }}
                      onClick={() =>
                        navigate(PRODUCT_ROUTE + "/" + productElem.id)
                      }
                      src={API_URL + PRODUCT_IMAGE_URL + productElem.img[0]}
                    />
                    {productElem.isHyped && (
                      <img className="product-hit-icon" src="/assets/hit.png" />
                    )}
                  </div>

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
                    onClick={() =>
                      navigate(PRODUCT_ROUTE + "/" + productElem.id)
                    }
                    className="product-name"
                  >
                    {productElem.name}
                  </div>
                  <div className="product-price-and-discount">
                    {productElem.discount && productElem.discount !== 1 && (
                      <div className="discounted-price">
                        {Math.ceil(productElem.price * productElem.discount)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                        &#x20BD;
                      </div>
                    )}
                    <div
                      className="product-oldPrice"
                      style={
                        productElem.discount && productElem.discount !== 1
                          ? {
                              textDecoration: "line-through",
                              fontSize: "0.7rem",
                            }
                          : {}
                      }
                    >
                      {productElem.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                      &#x20BD;
                    </div>
                    <div className="product-left-container">
                      <img
                        className="product-left-icon"
                        src={
                          productElem.left && productElem.left > 0
                            ? "/assets/checkmark.svg"
                            : "/assets/delete.png"
                        }
                      />
                      <div>
                        {productElem.left && productElem.left > 0
                          ? "В наличии"
                          : "Не в наличии"}
                      </div>
                    </div>
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
                        className="product-option-container"
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

                      <div
                        onClick={async () => {
                          if (
                            product.cart.find(
                              (elem) => elem === Number(productElem.id)
                            )
                          ) {
                            await setProduct((oldProduct) => ({
                              ...oldProduct,
                              cart: oldProduct.cart.filter(
                                (elem) => elem !== Number(productElem.id)
                              ),
                            }));
                          } else {
                            await setProduct((oldProduct) => ({
                              ...oldProduct,
                              cart: [
                                ...oldProduct.cart,
                                Number(productElem.id),
                              ],
                            }));
                          }
                        }}
                        className="product-option-container"
                      >
                        <img
                          className="product-heart product-heart-empty"
                          src="/assets/cart.svg"
                        />
                        <div>
                          {product.cart.find(
                            (elem) => elem === Number(productElem.id)
                          )
                            ? "Убрать из корзины"
                            : "Добавить в корзину"}
                        </div>
                      </div>
                      <div
                        onClick={async () => {
                          if (
                            product.toCompare.find(
                              (elem) => elem === Number(productElem.id)
                            )
                          ) {
                            await setProduct((oldProduct) => ({
                              ...oldProduct,
                              toCompare: oldProduct.toCompare.filter(
                                (elem) => elem !== Number(productElem.id)
                              ),
                            }));
                          } else {
                            await setProduct((oldProduct) => ({
                              ...oldProduct,
                              toCompare:
                                oldProduct.toCompare.length < 2
                                  ? [
                                      ...oldProduct.toCompare,
                                      Number(productElem.id),
                                    ]
                                  : oldProduct.toCompare.map((element, index) =>
                                      index === 1
                                        ? Number(productElem.id)
                                        : element
                                    ),
                            }));
                            if (
                              product.toCompare.length === 1 ||
                              product.toCompare.length === 2
                            ) {
                              navigate(COMPARE_ROUTE);
                            }
                          }
                        }}
                        className="product-option-container"
                      >
                        <img
                          style={{
                            width: "30px",
                            height: "30px",
                          }}
                          className="compare-icon"
                          src="/assets/scale.png"
                        />
                        <div>
                          {product.toCompare.find(
                            (elem) => elem === Number(productElem.id)
                          )
                            ? "Убрать из сравнения"
                            : "Сравнить"}
                        </div>
                      </div>
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
                ? products[0].info.map((statElem, index) => (
                    <div>
                      <div className="compare-page-stats">
                        <div key={nanoid()} className="compare-page-stat">
                          {statElem.key}: {statElem.value}
                        </div>
                      </div>
                    </div>
                  ))
                : statsInCommon.map((statElem, index) => (
                    <div>
                      <div
                        style={
                          statElem.value === statElem.value2
                            ? { backgroundColor: "var(--green-a)" }
                            : {}
                        }
                        className="compare-page-stats"
                      >
                        <div key={nanoid()} className="compare-page-stat">
                          {statElem.key}: {statElem.value}
                        </div>
                        <div key={nanoid()} className="compare-page-stat">
                          {statElem.key}: {statElem.value2}
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

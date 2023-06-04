import react, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../App";
import {
  API_URL,
  COMPARE_ROUTE,
  PRODUCT_IMAGE_URL,
  PRODUCT_ROUTE,
} from "../../utils/consts";
import {
  addToFavourite,
  removeFromFavourite,
  getFavouriteIds,
} from "../../API/productAPI";

export default function ProductCard({
  id,
  typeId,
  brandId,
  img,
  rating,
  name,
  price,
  discount,
  isHyped,
  left,
}) {
  const { product, setProduct, user } = useContext(Context);

  const [isHoveredOver, setIsHoveredOver] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="product-card">
      <img
        onClick={() => navigate(PRODUCT_ROUTE + "/" + id)}
        className="product-image"
        src={API_URL + PRODUCT_IMAGE_URL + img[0]}
      />
      <div className="type-and-rating">
        <div>
          <div className="type-brand">
            {product.types.find((type) => type.id === typeId).name}
          </div>
          <div className="type-brand">
            {product.brands.find((brand) => brand.id === brandId).name}
          </div>
        </div>
        <div className="rating">
          {rating > 0 ? (
            <>
              <div>{rating}</div>
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
        onClick={() => navigate(PRODUCT_ROUTE + "/" + id)}
        className="product-name"
      >
        {name}
      </div>

      <div
        onClick={() => navigate(PRODUCT_ROUTE + "/" + id)}
        className="product-price-and-discount"
      >
        {discount && discount !== 1 && (
          <div className="discounted-price">
            {Math.ceil(price * discount)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
            &#x20BD;
          </div>
        )}
        <div
          className="product-oldPrice"
          style={
            discount && discount !== 1
              ? { textDecoration: "line-through", fontSize: "0.8rem" }
              : {}
          }
        >
          {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}&#x20BD;
        </div>
        <div className="product-left-container">
          <img
            className="product-left-icon"
            src={
              left && left > 0 ? "/assets/checkmark.svg" : "/assets/delete.png"
            }
          />
          <div>{left && left > 0 ? "В наличии" : "Не в наличии"}</div>
        </div>
      </div>
      <div>
        {user.isAuth && (
          <>
            <div
              onClick={async () => {
                if (product.favourite.find((elem) => elem.productId === id)) {
                  await removeFromFavourite(id);
                } else {
                  await addToFavourite(id);
                }
                let favourite = await getFavouriteIds();
                await setProduct((oldProduct) => ({
                  ...oldProduct,
                  favourite: favourite,
                }));
              }}
              onMouseOver={async () => {
                setIsHoveredOver(true);
              }}
              onMouseLeave={async () => {
                setIsHoveredOver(false);
              }}
              className="product-option-container"
            >
              <div className="product-heart-icon-container">
                <img
                  style={{
                    filter:
                      "invert(30%) sepia(67%) saturate(6061%) hue-rotate(352deg) brightness(96%) contrast(110%)",
                  }}
                  className="product-heart product-heart-empty"
                  src="/assets/eheart.svg"
                />
                <img
                  className="product-heart product-heart-full"
                  style={
                    product.favourite.find((elem) => elem.productId === id)
                      ? isHoveredOver
                        ? { opacity: 0, transition: "500ms opacity ease-in" }
                        : { opacity: 1 }
                      : isHoveredOver
                      ? { opacity: 1, transition: "500ms opacity ease-in" }
                      : {}
                  }
                  src="/assets/fheart.svg"
                />
              </div>

              <div className="product-heart-text">
                {product.favourite.find((elem) => elem.productId === id)
                  ? "В избранном"
                  : "В избранное"}
              </div>
            </div>
            <div
              onClick={async () => {
                if (product.cart.find((elem) => elem === id)) {
                  await setProduct((oldProduct) => ({
                    ...oldProduct,
                    cart: oldProduct.cart.filter((elem) => elem !== id),
                  }));
                } else {
                  await setProduct((oldProduct) => ({
                    ...oldProduct,
                    cart: [...oldProduct.cart, id],
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
                {product.cart.find((elem) => elem === id)
                  ? "Убрать из корзины"
                  : "В корзину"}
              </div>
            </div>
            <div
              onClick={async () => {
                if (product.toCompare.find((elem) => elem === id)) {
                  await setProduct((oldProduct) => ({
                    ...oldProduct,
                    toCompare: oldProduct.toCompare.filter(
                      (elem) => elem !== id
                    ),
                  }));
                } else {
                  await setProduct((oldProduct) => ({
                    ...oldProduct,
                    toCompare:
                      oldProduct.toCompare.length < 2
                        ? [...oldProduct.toCompare, id]
                        : oldProduct.toCompare.map((element, index) =>
                            index === 1 ? id : element
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
                {product.toCompare.find((elem) => elem === id)
                  ? "Добавлено в сравнение"
                  : "Сравнить"}
              </div>
            </div>

            {/* добавить в корзину */}

            <div>
              Доставка:{" "}
              <span className="product-delivery-date">в течение недели</span>
            </div>

            {isHyped && (
              <img className="product-hit-icon" src="/assets/hit.png" />
            )}
          </>
        )}
      </div>
    </div>
  );
}

import react, { useContext, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { Context } from "../../App";
import { API_URL, PRODUCT_IMAGE_URL, PRODUCT_ROUTE } from "../../utils/consts";
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
}) {
  const { product, setProduct, user } = useContext(Context);

  const navigate = useNavigate();
  console.log(
    id +
      " " +
      nanoid() +
      " " +
      product.favourite.find((elem) => elem.productId === id)
  );
  return (
    <div className="product-card">
      <img
        onClick={() => navigate(PRODUCT_ROUTE + "/" + id)}
        className="product-image"
        src={API_URL + PRODUCT_IMAGE_URL + img[0]}
      />
      <div className="type-and-rating">
        <div className="type-brand">
          {product.types.find((type) => type.id === typeId).name +
            " " +
            product.brands.find((brand) => brand.id === brandId).name}
        </div>
        <div className="rating">
          {rating > 0 ? (
            <>
              <div>{rating}</div>
              <img src="/assets/star.svg" />
            </>
          ) : (
            <div>Нет отзывов</div>
          )}
        </div>
      </div>
      <div
        onClick={() => navigate(PRODUCT_ROUTE + "/" + id)}
        className="product-name"
      >
        {name}
      </div>
      {user.isAuth && (
        <div
          onClick={async () => {
            if (product.favourite.find((elem) => elem.productId === id)) {
              await removeFromFavourite(id);
            } else {
              await addToFavourite(id, user.user.id);
            }
            let favourite = await getFavouriteIds(user.user.id);
            await setProduct((oldProduct) => ({
              ...oldProduct,
              favourite: favourite,
            }));
          }}
          className="product-heart-container"
        >
          <div className="product-heart-icon-container">
            <img
              className="product-heart product-heart-empty"
              src="/assets/eheart.svg"
            />
            <img
              className={
                product.favourite.find((elem) => elem.productId === id)
                  ? "product-heart product-heart-full shown"
                  : "product-heart product-heart-full hidden"
              }
              style={
                product.favourite.find((elem) => elem.productId === id)
                  ? { opacity: 1 }
                  : {}
              }
              src="/assets/fheart.svg"
            />
          </div>

          <div className="product-heart-text">Добавить в избранное</div>
        </div>
      )}
    </div>
  );
}

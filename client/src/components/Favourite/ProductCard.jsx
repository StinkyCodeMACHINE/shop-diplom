import react, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../App";
import { API_URL, PRODUCT_IMAGE_URL, PRODUCT_ROUTE } from "../../utils/consts";
import { removeFromFavourite, getFavouriteIds } from "../../API/productAPI";

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
      <div onClick={async () => {
        await removeFromFavourite(id)
        const result = {};
        result.favourite = user.user.id
          ? await getFavouriteIds(user.user.id)
          : [];
        await setProduct((oldProduct) => ({
          ...oldProduct,
          favourite: result.favourite,
        }));
      }} className="product-remove-favourite-button">
            Убрать из избранного
      </div>
    </div>
  );
}

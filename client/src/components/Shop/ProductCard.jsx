import react, { useContext, useEffect, useState } from "react";
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

  const [isHoveredOver, setIsHoveredOver] = useState(false)

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
          onMouseOver={async () => {
            setIsHoveredOver(true);
          }}
          onMouseLeave={async () => {
            setIsHoveredOver(false);
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
                product.favourite.find((elem) => elem.productId === id)
                  ? isHoveredOver
                    ? { opacity: 0, transition: "600ms opacity ease-in" }
                    : { opacity: 1 }
                  : isHoveredOver
                  ? { opacity: 1, transition: "600ms opacity ease-in" }
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

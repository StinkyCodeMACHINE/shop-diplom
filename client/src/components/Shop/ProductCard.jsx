import react, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../App";
import { API_URL, PRODUCT_IMAGE_URL, PRODUCT_ROUTE } from "../../utils/consts";
import { addToFavourite, removeFromFavourite } from "../../API/productAPI";

export default function ProductCard({
  id,
  typeId,
  brandId,
  img,
  rating,
  name,
}) {
  const { product, user } = useContext(Context);
  const [isFavourite, setIsFavourite] = useState(
    product.favourite.find((elem) => elem.productId === id) ? true : false
  );

  useEffect(() => {
    setIsFavourite(
      product.favourite.find((elem) => elem.productId === id) ? true : false
    );
  }, [product.favourite]);

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
            await setIsFavourite(!isFavourite);
            isFavourite
              ? await removeFromFavourite(id, user.user.id)
              : await addToFavourite(id, user.user.id);
          }}
          className="product-heart-container"
        >
          <div className="product-heart-icon-container">
            <img
              style={!isFavourite ? { zIndex: 500 } : {}}
              className="product-heart product-heart-empty"
              src="/assets/eheart.svg"
            />
            <img
              className="product-heart product-heart-full"
              style={isFavourite ? { opacity: 1, zIndex: 500 } : { opacity: 0 }}
              src="/assets/fheart.svg"
            />
          </div>

          <div className="product-heart-text">Добавить в избранное</div>
        </div>
      )}
    </div>
  );
}

import react, { useContext, useState } from "react";
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
  const [isFavourite, setIsFavourite] = useState(product.favourite.includes(id)); //заменить

  
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
      <div className="product-heart-icon-container">
        <img
          style={!isFavourite ? { zIndex: 999 } : {}}
          className="product-heart product-heart-empty"
          onClick={async () => {
            await setIsFavourite(true);
            addToFavourite(id, user.user.id);
          }}
          src="/assets/eheart.svg"
        />
        <img
          className="product-heart product-heart-full"
          style={isFavourite ? { opacity: 1, zIndex: 999 } : { opacity: 0 }}
          onClick={async () => {
            await setIsFavourite(false);
            removeFromFavourite(id, user.user.id);
          }}
          src="/assets/fheart.svg"
        />
      </div>
    </div>
  );
}

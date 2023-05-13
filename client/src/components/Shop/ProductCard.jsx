import react, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../App";
import { API_URL, PRODUCT_IMAGE_URL, PRODUCT_ROUTE } from "../../utils/consts";
import { addToFavourite } from "../../API/productAPI";

export default function ProductCard({ id, typeId, brandId, img, rating, name }) {
  const { product } = useContext(Context);

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
      <img
        className="product-heart"
        onClick={() => addToFavourite(id)}
        src="/assets/eheart.svg"
      />
    </div>
  );
}

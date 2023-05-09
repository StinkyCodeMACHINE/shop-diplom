import react, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import { API_URL, PRODUCT_IMAGE_URL, PRODUCT_ROUTE } from "../utils/consts";

export default function ProductCard({ id, typeId, brandId, img, rating }) {
  const { product } = useContext(Context);

  const navigate = useNavigate();
  return (
    <div
      className="product-card"
      onClick={() => navigate(PRODUCT_ROUTE + "/" + id)}
    >
      <img className="product-image" src={API_URL + PRODUCT_IMAGE_URL + img} />
      <div className="type-and-rating">
        <div className="type-brand">
          {product.types.find((type) => type.id === typeId).name +
            " " +
            product.brands.find((brand) => brand.id === brandId).name}
        </div>
        <div className="rating">
          {rating}
          <img src="/assets/star.svg" />
        </div>
      </div>
      <div className="product-name">{name}</div>
    </div>
  );
}

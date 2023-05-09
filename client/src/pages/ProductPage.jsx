import react, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOneProduct } from "../API/productAPI";
import { API_URL, PRODUCT_IMAGE_URL } from "../utils/consts";

export default function ProductPage() {
  const [product, setProduct] = useState({ info: [] });
  const { id } = useParams();

  useEffect(() => {
    getOneProduct(id).then((data) => setProduct(data));
  }, []);

  return (
    product.img && (
      <div className="product-page-main-container">
        <div className="product-page-top-container">
          <img
            src={product.img ? API_URL + PRODUCT_IMAGE_URL + product.img : ""}
            className="product-page-img"
          />
          <div className="product-page-name-and-rating">
            <div className="product-page-name">{product.name}</div>
            <div className="product-page-rating">{product.rating}</div>
          </div>
          <div className="product-page-add-to-card-container">
            <div>От {product.price} руб.</div>
            <button>Добавить в корзину</button>
          </div>
        </div>
        <div className="product-page-bottom-container">
          <h2>Характеристики: </h2>
          <div className="product-page-stats">
            {product.info.map((stat) => {
              return (
                <div
                  key={stat.id}
                  style={stat.id % 2 === 1 ? { backgroundColor: "white" } : {}}
                  className="product-page-stat"
                >
                  {stat.title}: {stat.description}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )
  );
}

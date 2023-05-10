import react, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOneProduct } from "../API/productAPI";
import Rating from "../components/Rating";
import { API_URL, PRODUCT_IMAGE_URL } from "../utils/consts";

export default function ProductPage() {
  const [product, setProduct] = useState({ info: [] });
  const { id } = useParams();
  const rating = [
    {
      img: "1.jpg",
      message: "AAAAAAAAA",
      date: new Date(Date.now()).getFullYear(),
      rating: 3,
    },
    {
      img: "1.jpg",
      message: "BBBBBBBBBBBBBB",
      date: new Date(Date.now()).getFullYear(),
      rating: 2,
    },
    {
      img: "1.jpg",
      message: "CCCCCCCCCCCCC",
      date: new Date(Date.now()).getFullYear(),
      rating: 4,
    },
    {
      img: "1.jpg",
      message:
        "DDDDDDDdddddddddDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
      date: new Date(Date.now()).getFullYear(),
      rating: 5,
    },
    {
      img: "1.jpg",
      message: "EEEEEEEEEEEE",
      date: new Date(Date.now()).getFullYear(),
      rating: 1,
    },
    {
      img: "1.jpg",
      message: "FFFFFffFFFFFF",
      date: new Date(Date.now()).getFullYear(),
      rating: 2,
    },
  ];

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

          <h2>Отзывы: </h2>
          <div className="product-page-stats">
            {rating.map((ratingElem) => {
              return (
                <Rating
                  img={ratingElem.img}
                  message={ratingElem.message}
                  date={ratingElem.date}
                  rating={ratingElem.rating}
                />
              );
            })}
          </div>
        </div>
      </div>
    )
  );
}

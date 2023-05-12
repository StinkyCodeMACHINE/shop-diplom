import react, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOneProduct } from "../API/productAPI";
import Rating from "../components/ProductPage.jsx/Rating";
import AddRating from "../components/ProductPage.jsx/AddRating";
import { API_URL, PRODUCT_IMAGE_URL } from "../utils/consts";

export default function ProductPage() {
  const [product, setProduct] = useState({ info: [], ratings: [] });
  const { id } = useParams();

  const rating = [
    {
      id: 1,
      name: "cat",
      thumbsUp: 0,
      img: "1.jpg",
      text: "AAAAAAAAA",
      date: new Date(Date.now()),
      rating: 3,
    },
    {
      id: 2,
      name: "cat",
      thumbsUp: 3,
      img: "1.jpg",
      text: "BBBBBBBBBBBBBB",
      date: new Date(Date.now()),
      rating: 2,
    },
    {
      id: 3,
      name: "cat",
      thumbsUp: 0,
      img: "1.jpg",
      date: new Date(Date.now()),
      rating: 4,
    },
    {
      id: 4,
      name: "cat",
      thumbsUp: 0,
      img: "1.jpg",
      text: "DDDDDDDdddddddddDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
      date: new Date(Date.now()),
      rating: 5,
    },
    {
      id: 5,
      name: "cat",
      thumbsUp: 0,
      img: "1.jpg",
      text: "EEEEEEEEEEEE",
      date: new Date(Date.now()),
      rating: 1,
    },
    {
      id: 6,
      name: "cat",
      thumbsUp: 0,
      img: "1.jpg",
      text: "FFFFFffFFFFFF",
      date: new Date(Date.now()),
      rating: 2,
    },
  ];

  useEffect(() => {
    getOneProduct(id)
      .then((data) => setProduct(data))
      .then(
        (data) =>
          setProduct((oldProduct) => ({ ...oldProduct, ratings: rating })) //временно
      );
  }, []);

  return (
    product.img && (
      <div className="product-page-main-container">
        <div className="product-page-top-container">
          <img
            src={product.img ? API_URL + PRODUCT_IMAGE_URL + product.img[0] : ""}
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
          <AddRating product={product} setProduct={setProduct} />
          <div className="product-page-ratings">
            {product.ratings.map((ratingElem) => {
              return (
                <Rating
                  key={ratingElem.id}
                  img={ratingElem.img}
                  text={ratingElem.text}
                  date={ratingElem.date}
                  rating={ratingElem.rating}
                  name={ratingElem.name}
                  thumbsUp={ratingElem.thumbsUp}
                />
              );
            })}
          </div>
        </div>
      </div>
    )
  );
}

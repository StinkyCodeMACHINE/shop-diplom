import react, { useContext, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  getOneProduct,
  getFavouriteIds,
  removeFromFavourite,
  addToFavourite
} from "../API/productAPI";
import Rating from "../components/ProductPage.jsx/Rating";
import AddRating from "../components/ProductPage.jsx/AddRating";
import { API_URL, PRODUCT_IMAGE_URL } from "../utils/consts";
import { Context } from "../App";

export default function ProductPage() {
  const [productElem, setProductElem] = useState({ info: [], ratings: [] });
  const { product, setProduct, user } = useContext(Context);

  const { id } = useParams();
  const { state } = useLocation();

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
    async function apiCalls() {
      const favourite = user.user.id ? await getFavouriteIds(user.user.id) : [];
      await setProduct((oldProduct) => ({
        ...oldProduct,
        favourite,
      }));
    }

    apiCalls();
  }, [user.user.id]);

  useEffect(() => {
    async function apiCalls() {
      let data = await getOneProduct(id);
      await setProductElem(data);
      await setProductElem((oldProductElem) => ({
        ...oldProductElem,
        ratings: rating,
      }));
    }
    apiCalls();
  }, [state]);

  return (
    productElem.img && (
      <div className="product-page-main-container">
        <div className="product-page-top-container">
          <img
            src={
              productElem.img
                ? API_URL + PRODUCT_IMAGE_URL + productElem.img[0]
                : ""
            }
            className="product-page-img"
          />
          <div className="product-page-name-and-rating">
            <div className="product-page-name">{productElem.name}</div>
            <div className="product-page-rating">{productElem.rating}</div>
          </div>
          <div className="productElem-page-add-to-card-container">
            <div>От {productElem.price} руб.</div>

            {user.isAuth && (
              <div
                onClick={async () => {
                  if (product.favourite.find((elem) => elem.productId === Number(id))) {
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
                      product.favourite.find((elem) => elem.productId === Number(id))
                        ? "product-heart product-heart-full shown"
                        : "product-heart product-heart-full hidden"
                    }
                    style={
                      product.favourite.find((elem) => elem.productId === Number(id))
                        ? { opacity: 1 }
                        : {}
                    }
                    src="/assets/fheart.svg"
                  />
                </div>

                <div className="product-heart-text">Добавить в избранное</div>
              </div>
            )}

            <button>Добавить в корзину</button>
          </div>
        </div>
        <div className="product-page-bottom-container">
          <h2>Характеристики: </h2>
          <div className="product-page-stats">
            {productElem.info.map((stat) => {
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
          <AddRating product={productElem} setProductElem={setProductElem} />
          <div className="product-page-ratings">
            {productElem.ratings.map((ratingElem) => {
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

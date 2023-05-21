import react, { useContext, useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  getOneProduct,
  getFavouriteIds,
  removeFromFavourite,
  addToFavourite,
  getTypes,
  getGroups,
} from "../API/productAPI";
import Review from "../components/ProductPage.jsx/Review";
import AddReview from "../components/ProductPage.jsx/AddReview";
import { API_URL, PRODUCT_IMAGE_URL } from "../utils/consts";
import { Context } from "../App";

export default function ProductPage() {
  const [productElem, setProductElem] = useState({ info: [], ratings: [] });
  const [currentSelection, setCurrentSelection] = useState(0);

  const [renderedOnce, setRenderedOnce] = useState(false);
  const { product, setProduct, user } = useContext(Context);

  const { id } = useParams();
  const { state } = useLocation();

  const [isHoveredOver, setIsHoveredOver] = useState(false);

  const rating = [
    {
      id: 1,
      name: "cat",
      thumbsUp: 0,
      thumbsDown: 0,
      img: "1.jpg",
      text: "AAAAAAAAA",
      date: new Date(Date.now()),
      rating: 3,
    },
    {
      id: 2,
      name: "cat",
      thumbsUp: 3,
      thumbsDown: 0,
      img: "1.jpg",
      text: "BBBBBBBBBBBBBB",
      date: new Date(Date.now()),
      rating: 2,
    },
    {
      id: 3,
      name: "cat",
      thumbsUp: 0,
      thumbsDown: 3,
      img: "1.jpg",
      date: new Date(Date.now()),
      rating: 4,
    },
    {
      id: 4,
      name: "cat",
      thumbsUp: 0,
      thumbsDown: 4,
      img: "1.jpg",
      text: "DDDDDDDdddddddddDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
      date: new Date(Date.now()),
      rating: 5,
    },
    {
      id: 5,
      name: "cat",
      thumbsUp: 0,
      thumbsDown: 0,
      img: "1.jpg",
      text: "EEEEEEEEEEEE",
      date: new Date(Date.now()),
      rating: 1,
    },
    {
      id: 6,
      name: "cat",
      thumbsUp: 0,
      thumbsDown: 2,
      img: "1.jpg",
      text: "FFFFFffFFFFFF",
      date: new Date(Date.now()),
      rating: 2,
    },
  ];

  useEffect(() => {
    console.log("ass1");
    async function apiCalls() {
      const favourite = user.user.id ? await getFavouriteIds(user.user.id) : [];
      const types =
        product.types.length === 0 ? await getTypes() : product.types;
      const groups =
        product.groups.length === 0 ? await getGroups() : product.groups;
      await setProduct((oldProduct) => ({
        ...oldProduct,
        favourite,
        types,
        groups,
      }));
    }

    apiCalls();
  }, []);

  useEffect(() => {
    console.log("ass2");
    async function apiCalls() {
      const oneProduct = await getOneProduct(id);
      const type = product.types.find((type) => type.id === oneProduct.typeId);
      console.log("type groupId: " + type.groupId);
      console.log(product.types);
      console.log("type: " + JSON.stringify(type));
      console.log("groups: " + product.groups);
      const group = product.groups.find((group) => group.id === type.groupId);

      await setProductElem({
        ...oneProduct,
        ratings: rating,
        type: type ? type : "",
        group: group ? group : "",
      });
    }

    product.types.length > 0 && product.groups.length > 0 && apiCalls();
    setRenderedOnce(true);
  }, [state, product.types]);

  console.log("PP types: " + JSON.stringify(product.types));
  return (
    productElem.img &&
    renderedOnce && (
      <div className="product-page-main-container">
        {productElem.type && (
          <div className="product-page-group-and-type">
            <Link className="product-page-catalogue">Каталог</Link>
            <div>{">"}</div>
            <Link className="product-page-group">{productElem.group.name}</Link>
            <div>{">"}</div>
            <Link className="product-page-type">{productElem.type.name}</Link>
          </div>
        )}

        <div className="product-page-top-container">
          <div className="product-page-name-and-pic-container">
            <div className="product-page-name">
              <div className="product-page-name">{productElem.name}</div>
            </div>
            <div className="product-page-img-and-subimgs">
              <div className="product-page-subimgs-container">
                {productElem.img.map((imgElem, index) => {
                  return (
                    <img
                      className="product-page-subimg"
                      src={API_URL + PRODUCT_IMAGE_URL + imgElem}
                      style={
                        currentSelection === index
                          ? { outline: "1px solid blue" }
                          : {}
                      }
                      onClick={() => setCurrentSelection(index)}
                    />
                  );
                })}
              </div>
              <img
                src={
                  productElem.img
                    ? API_URL +
                      PRODUCT_IMAGE_URL +
                      productElem.img[currentSelection]
                    : ""
                }
                className="product-page-img"
              />
            </div>
          </div>

          <div className="product-page-name-and-rating">
            <div className="product-page-rating">{productElem.rating}</div>
          </div>
          <div className="productElem-page-add-to-card-container">
            <div>От {productElem.price} руб.</div>

            {user.isAuth && (
              <div
                onClick={async () => {
                  if (
                    product.favourite.find(
                      (elem) => elem.productId === Number(id)
                    )
                  ) {
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
                      product.favourite.find(
                        (elem) => elem.productId === Number(id)
                      )
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
          <AddReview
            productElem={productElem}
            setProductElem={setProductElem}
          />
          <div className="product-page-ratings">
            {productElem.ratings.map((ratingElem) => {
              return (
                <Review
                  key={ratingElem.id}
                  img={ratingElem.img}
                  text={ratingElem.text}
                  date={ratingElem.date}
                  rating={ratingElem.rating}
                  name={ratingElem.name}
                  thumbsUp={ratingElem.thumbsUp}
                  thumbsDown={ratingElem.thumbsDown}
                />
              );
            })}
          </div>
        </div>
      </div>
    )
  );
}

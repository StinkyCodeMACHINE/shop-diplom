import react, { useState, useContext } from "react";
import {
  rateReview,
  getReviewRatings,
  deleteReviewRating,
} from "../../API/productAPI";
import { Context } from "../../App";
import { API_URL, PROFILE_IMAGE_URL } from "../../utils/consts";

export default function Rating({
  id,
  reviewRating,
  productElem,
  setProductElem,
  img,
  text,
  advantages,
  disadvantages,
  date,
  rating,
  name,
  diff,
  setReviewRatings,
}) {

  const {  user } = useContext(Context);

  const [diffValue, setDiffValue] = useState(diff);
  
  const starsArr = [];
  for (let i = 0; i < 5; i++) {
    starsArr.push(i + 1);
  }

  return (
    <div className="product-rating-container">
      <div className="product-rating-profile-image-and-name-container">
        <img
          className="product-rating-profile-image"
          src={
            img
              ? API_URL + PROFILE_IMAGE_URL + img
              : "/assets/default-profile-pic.png"
          }
        />
        <div className="product-rating-profile-name">{name}</div>
      </div>

      <div className="product-rating-rating-and-stuff-inner-container">
        <div className="product-rating-user-rating">
          {starsArr.map((star) => {
            return (
              <img
                key={star}
                className="product-rating-star-icon"
                src={
                  star <= rating
                    ? "/assets/fratingstar.png"
                    : "/assets/eratingstar.png"
                }
              />
            );
          })}
        </div>
        <div className="product-rating-date">
          Дата:{" "}
          {`${Math.floor((Date.now() - date) / 86400000)} дней назад`}
        </div>
        <div>
          <h2>Преимущества</h2>
          <p className="product-rating-text">{advantages}</p>
        </div>
        <div>
          <h2>Недостатки</h2>
          <p className="product-rating-text">{disadvantages}</p>
        </div>
        <div>
          <h2>Отзыв</h2>
          <p className="product-rating-text">{text}</p>
        </div>
        <div className="product-rating-thumb-container">
          <img
            onClick={async () => {
              if (reviewRating && reviewRating.liked) {
                await deleteReviewRating({ id: productElem.id, reviewId: id });
                await setDiffValue((oldDiffValue) => oldDiffValue - 1);
                const reviewRatings = await getReviewRatings({
                  id: productElem.id,
                });
                await setReviewRatings(reviewRatings);
              } else if (reviewRating && !reviewRating.liked) {
                setDiffValue((oldDiffValue) => oldDiffValue + 2);
                await rateReview({
                  id: productElem.id,
                  reviewId: id,
                  liked: true,
                });
                const reviewRatings = await getReviewRatings({
                  id: productElem.id,
                });
                await setReviewRatings(reviewRatings);
              } else {
                setDiffValue((oldDiffValue) => oldDiffValue + 1);
                await rateReview({
                  id: productElem.id,
                  reviewId: id,
                  liked: true,
                });
                const reviewRatings = await getReviewRatings({
                  id: productElem.id,
                });
                await setReviewRatings(reviewRatings);
              }
            }}
            style={
              reviewRating && reviewRating.liked
                ? {
                    filter:
                      "invert(57%) sepia(42%) saturate(5570%) hue-rotate(180deg) brightness(104%) contrast(86%)",
                  }
                : {}
            }
            className="product-rating-thumb-icon"
            src={"/assets/like.png"}
          />

          <div className="product-rating-thumb-counter">{diffValue}</div>

          <img
            onClick={async () => {
              if (reviewRating && !reviewRating.liked) {
                await deleteReviewRating({ id: productElem.id, reviewId: id });
                await setDiffValue((oldDiffValue) => oldDiffValue + 1);
                const reviewRatings = await getReviewRatings({
                  id: productElem.id,
                });
                await setReviewRatings(reviewRatings);
              } else if (reviewRating && reviewRating.liked) {
                await setDiffValue((oldDiffValue) => oldDiffValue - 2);
                await rateReview({
                  id: productElem.id,
                  reviewId: id,
                  liked: false,
                });
                const reviewRatings = await getReviewRatings({
                  id: productElem.id,
                });
                await setReviewRatings(reviewRatings);
              } else {
                setDiffValue((oldDiffValue) => oldDiffValue - 1);
                await rateReview({
                  id: productElem.id,
                  reviewId: id,
                  liked: false,
                });
                const reviewRatings = await getReviewRatings({
                  id: productElem.id,
                });
                await setReviewRatings(reviewRatings);
              }
            }}
            style={
              reviewRating && !reviewRating.liked
                ? {
                    filter:
                      "invert(57%) sepia(42%) saturate(5570%) hue-rotate(180deg) brightness(104%) contrast(86%)",
                  }
                : {}
            }
            className="product-rating-thumb-icon"
            src={"/assets/dislike.png"}
          />
        </div>
      </div>
    </div>
  );
}

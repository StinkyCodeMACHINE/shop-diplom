import react from "react";
import { API_URL, PROFILE_IMAGE_URL } from "../../utils/consts";

export default function Rating({
  img,
  text,
  date,
  rating,
  thumbsUp,
  thumbsDown,
  name,
}) {
  const starsArr = [];
  for (let i = 0; i < 5; i++) {
    starsArr.push(i + 1);
  }
  return (
    <div className="product-rating-container">
      <div className="product-rating-profile-image-and-name-container">
        <img
          className="product-rating-profile-image"
          src={API_URL + PROFILE_IMAGE_URL + img}
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
          {`${date.getHours()}:${date.getMinutes()} ${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`}
        </div>
        <p className="product-rating-text">{text}</p>
        <div className="product-rating-thumbsup-thumbsdown-container">
          <div
            onClick={() => {
              thumbsUp = thumbsUp + 1; //заменить
            }}
            className="product-rating-thumbsup-thumbsdown-inner-container"
          >
            <div>Понравилось? </div>
            <div className="product-rating-thumb-icon-container">
              <img
                className="product-rating-thumbsup-icon"
                src={"/assets/like.png"}
              />
              <div className="product-rating-thumb-counter">{thumbsUp}</div>
            </div>
          </div>
          <div
            onClick={() => {
              thumbsDown = thumbsDown + 1; //заменить
            }}
            className="product-rating-thumbsup-thumbsdown-inner-container"
          >
            <div>Не понравилось? </div>
            <div className="product-rating-thumb-icon-container">
              <img
                className="product-rating-thumbsdown-icon"
                src={"/assets/dislike.png"}
              />
              <div className="product-rating-thumb-counter">{thumbsDown}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

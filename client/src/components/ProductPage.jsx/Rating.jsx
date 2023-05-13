import react from "react";
import { API_URL, PROFILE_IMAGE_URL } from "../../utils/consts";

export default function Rating({ img, text, date, rating, thumbsUp, name }) {
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
        <div className="product-rating-thumbsup-container">
          <div>Понравилось? </div>

          <img
            className="product-rating-thumbsup-icon"
            src={"/assets/like.png"}
          />
        </div>
      </div>
    </div>
  );
}
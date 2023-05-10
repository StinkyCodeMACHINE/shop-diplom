import react from "react"
import { API_URL, PROFILE_IMAGE_URL } from '../utils/consts';

export default function Rating({img, message, date, rating}) {
    const starsArr = []
    for (let i = 0; i < 5; i++) {
      starsArr.push(i+1);
    }
    return (
      <div className="product-rating-container">
        <img className="product-rating-profile-image" src={API_URL + PROFILE_IMAGE_URL + img} />
        <div className="product-rating-message-and-rating-inner-container">
          <div className="product-rating-user-rating">
            {starsArr.map(star => {
                return (
                  <img className="product-rating-star-icon"
                    src={
                      star <= rating
                        ? "/assets/fratingstar.png"
                        : "/assets/eratingstar.png"
                    }
                  />
                );
            })}
                
                
          </div>
          <div className="product-rating-date">Дата: {date}</div>
          <p className="product-rating-message">{message}</p>
        </div>
      </div>
    );
}
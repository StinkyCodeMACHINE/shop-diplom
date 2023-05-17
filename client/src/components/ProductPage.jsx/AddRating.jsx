import react, { useState } from "react";

export default function AddRating({ productElem, setProductElem }) {
  const [inputValues, setInputValues] = useState({
    text: "",
    textLength: 0,
    rating: 1,
    tempRating: 1,
    isHoveredOver: false,
  });
  const starsArr = [];
  for (let i = 0; i < 5; i++) {
    starsArr.push(i + 1);
  }
  function addHandler(e) {
    e.preventDefault();
    productElem.ratings.push({
      id: 7,
      name: "dog",
      thumbsUp: 0,
      thumbsDown: 0,
      img: "1.jpg",
      text: inputValues.text,
      date: new Date(Date.now()),
      rating: inputValues.rating,
    });
    setProductElem((oldProduct) => ({ ...oldProduct }));
  }

  return (
    <div className="product-page-add-rating-container">
      <h3>Оставьте свой отзыв:</h3>
      <form>
        <div className="product-page-add-rating-stars-container">
          {starsArr.map((star) => {
            return (
              <img
                key={star}
                className="product-rating-star-icon"
                src={
                  inputValues.isHoveredOver
                    ? star <= inputValues.tempRating
                      ? "/assets/fratingstar.png"
                      : "/assets/eratingstar.png"
                    : star <= inputValues.rating
                    ? "/assets/fratingstar.png"
                    : "/assets/eratingstar.png"
                }
                onClick={() =>
                  setInputValues((oldInputValues) => ({
                    ...oldInputValues,
                    rating: star,
                  }))
                }
                onMouseOver={() => {
                  setInputValues((oldInputValues) => ({
                    ...oldInputValues,
                    tempRating: star,
                    isHoveredOver: true,
                  }));
                }}
                onMouseLeave={() => {
                  setInputValues((oldInputValues) => ({
                    ...oldInputValues,
                    isHoveredOver: false,
                  }));
                }}
              />
            );
          })}
        </div>

        <textarea
          className="product-page-add-rating-text"
          maxLength="300"
          placeholder="Введите текст отзыва"
          value={inputValues.text}
          onChange={(e) =>
            setInputValues((oldInputValues) => ({
              ...oldInputValues,
              text: e.target.value,
              textLength: e.target.value.length,
            }))
          }
        ></textarea>

        <div>Осталось символов: {300 - inputValues.textLength}</div>
        <div>
          <button onClick={addHandler}>Добавить</button>
        </div>
      </form>
    </div>
  );
}

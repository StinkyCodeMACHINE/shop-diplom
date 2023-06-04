import react, { useState, useEffect } from "react";
import {
  getReview,
  leaveReview,
  getReviews,
  countReviews,
} from "../../API/productAPI";

export default function AddReview({
  productElem,
  setProductElem,
  displayOptions,
}) {
  const [existingReview, setExistingReview] = useState({});
  const [inputValues, setInputValues] = useState({
    text: "",
    textLength: 0,
    rating: 0,
    tempRating: 0,
    isHoveredOver: false,
    advantages: "",
    advantagesLength: 0,
    disadvantages: "",
    disadvantagesLength: 0,
    currentReviewRating: 0,
  });

  useEffect(() => {
    console.log("ass1");
    async function apiCalls() {
      const check = await getReview(productElem.id);
      if (check) {
        await setExistingReview(check);
        await setInputValues((oldInputValues) => ({
          ...oldInputValues,
          currentReviewRating: check.rating,
        }));
      }
    }

    apiCalls();
  }, []);

  const starsArr = [];
  for (let i = 0; i < 5; i++) {
    starsArr.push(i + 1);
  }
  async function addHandler(e) {
    e.preventDefault();
    const { product, review } = await leaveReview({
      id: productElem.id,
      advantages: inputValues.advantages,
      disadvantages: inputValues.disadvantages,
      text: inputValues.text,
      rating: inputValues.rating,
      reviewCount: productElem.reviewCount,
    });

    await setExistingReview(review);
    const reviews = await getReviews({
      id: productElem.id,
      limit: displayOptions.limit.value,
      page: productElem.page,
      sorting: displayOptions.sorting.value,
    });
    const reviewCount = await countReviews(productElem.id);

    await setProductElem((oldProduct) => ({
      ...oldProduct,
      ...product,
      reviews: reviews.rows,
      reviewCount,
    }));

    await setInputValues({
      text: "",
      textLength: 0,
      rating: 0,
      tempRating: 0,
      isHoveredOver: false,
      advantages: "",
      advantagesLength: 0,
      disadvantages: "",
      disadvantagesLength: 0,
      currentReviewRating: review.rating,
    });
  }

  async function changeReview() {
    await setProductElem((oldProduct) => ({
      ...oldProduct,
      reviewCount: {
        totalCount: oldProduct.reviewCount.totalCount - 1,
        reviews: oldProduct.reviewCount.reviews.map((reviewElem) =>
          reviewElem.rating === existingReview.rating
            ? { ...reviewElem, count: Number(reviewElem.count) - 1 }
            : reviewElem
        ),
      },
      reviews: oldProduct.reviews.filter(
        (elem) => elem.id !== existingReview.id
      ),
    }));
    await setInputValues({
      text: existingReview.text,
      textLength: existingReview.text.length,
      rating: existingReview.rating,
      tempRating: 0,
      isHoveredOver: false,
      advantages: existingReview.advantages,
      advantagesLength: existingReview.advantages.length,
      disadvantages: existingReview.disadvantages,
      disadvantagesLength: existingReview.disadvantages.length,
      currentReviewRating: 0,
    });
    await setExistingReview({});
  }

  return (
    <>
      {existingReview && Object.keys(existingReview).length > 0 ? (
        <div className="product-your-rating">
          Ваша оценка:{" "}
          <div>
            {starsArr.map((star) => (
              <img
                key={star}
                className="product-rating-star-icon"
                src={
                  star <= inputValues.currentReviewRating
                    ? "/assets/fratingstar.png"
                    : "/assets/eratingstar.png"
                }
              />
            ))}
          </div>
          <span onClick={changeReview}>Изменить?</span>
        </div>
      ) : (
        <div className="product-page-add-rating-container">
          <h3>Оставьте свой отзыв:</h3>
          <form>
            <h4>Оценка</h4>
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

            <h4>Преимущества</h4>
            <div className="product-page-rating-text-and-counter-container">
              <textarea
                rows="6"
                className="product-page-add-rating-text"
                maxLength="1000"
                placeholder="Опишите преимущества"
                value={inputValues.advantages}
                onChange={(e) =>
                  setInputValues((oldInputValues) => ({
                    ...oldInputValues,
                    advantages: e.target.value,
                    advantagesLength: e.target.value.length,
                  }))
                }
              ></textarea>

              <div className="product-page-add-rating-counter">
                Осталось символов: {1000 - inputValues.advantagesLength}
              </div>
            </div>

            <h4>Недостатки</h4>
            <div className="product-page-rating-text-and-counter-container">
              <textarea
                rows="6"
                className="product-page-add-rating-text"
                maxLength="1000"
                placeholder="Опишите недостатки"
                value={inputValues.disadvantages}
                onChange={(e) =>
                  setInputValues((oldInputValues) => ({
                    ...oldInputValues,
                    disadvantages: e.target.value,
                    disadvantagesLength: e.target.value.length,
                  }))
                }
              ></textarea>

              <div className="product-page-add-rating-counter">
                Осталось символов: {1000 - inputValues.disadvantagesLength}
              </div>
            </div>

            <h4>Текст отзыва</h4>
            <div className="product-page-rating-text-and-counter-container">
              <textarea
                rows="6"
                className="product-page-add-rating-text"
                maxLength="1000"
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

              <div className="product-page-add-rating-counter">
                Осталось символов: {1000 - inputValues.textLength}
              </div>
            </div>

            <div className="product-add-container">
              {/* <div className="product-option-container" onClick={addHandler}>
                Добавить
              </div> */}
              <div onClick={addHandler} className="product-option-container">
                <div className="product-heart-icon-container">
                  <img
                    className="product-heart product-heart-empty"
                    src="/assets/add.png"
                  />
                </div>

                <div className="product-heart-text">Оставить отзыв</div>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

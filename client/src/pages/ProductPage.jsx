import react, { useContext, useEffect, useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import {
  getOneProduct,
  getFavouriteIds,
  removeFromFavourite,
  addToFavourite,
  getTypes,
  getGroups,
  getReviews,
  countReviews,
  getReviewRatings,
} from "../API/productAPI";
import Review from "../components/ProductPage/Review";
import AddReview from "../components/ProductPage/AddReview";
import {
  API_URL,
  PRODUCT_IMAGE_URL,
  SHOP_ROUTE,
  reviewLimitValues,
  reviewSortingValues,
  GROUP_TYPES_ROUTE,
  COMPARE_ROUTE,
} from "../utils/consts";
import { Context } from "../App";
import DefaultPagination from "../components/DefaultPagination";

export default function ProductPage() {
  const navigate = useNavigate();
  const [productElem, setProductElem] = useState({
    info: [],
    reviews: [],
    reviewCount: [],
  });
  const [currentSelection, setCurrentSelection] = useState(0); //доп фото
  const [renderedOnce, setRenderedOnce] = useState(false);
  const [displayOptions, setDisplayOptions] = useState({
    sorting: reviewSortingValues[0],
    limit: reviewLimitValues[0],
  });
  const [page, setPage] = useState(1);
  const [reviewRatings, setReviewRatings] = useState([]);

  const { product, setProduct, user, whatIsShown, setWhatIsShown } =
    useContext(Context);

  const { id } = useParams();
  const { state } = useLocation();

  const [isHoveredOver, setIsHoveredOver] = useState(false);
  const starsArr = [];
  for (let i = 0; i < 5; i++) {
    starsArr.push(i + 1);
  }

  //получение типов избранного и групп
  useEffect(() => {
    console.log("ass1");
    async function apiCalls() {
      const favourite = await getFavouriteIds();
      const types = await getTypes();
      const groups = await getGroups();
      const reviewRatings = user.isAuth && (await getReviewRatings({ id }));
      setReviewRatings(reviewRatings);
      await setProduct((oldProduct) => ({
        ...oldProduct,
        favourite,
        types,
        groups,
      }));
    }

    apiCalls();
  }, []);

  //запись товара и категории, группы
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

      await setProductElem((oldProduct) => ({
        ...oldProduct,
        ...oneProduct,
        type: type ? type : "",
        group: group ? group : "",
      }));
    }

    product.types.length > 0 && product.groups.length > 0 && apiCalls();
    setRenderedOnce(true);
  }, [state, product.types]);

  //поиск обзоров при изменении параметров отображения
  useEffect(() => {
    console.log("ass2");
    async function apiCalls() {
      const reviews = await getReviews({
        id,
        limit: displayOptions.limit.value,
        page: 1,
        sorting: displayOptions.sorting.value,
      });
      const reviewCount = await countReviews(id);

      await setProductElem((oldProduct) => ({
        ...oldProduct,
        reviews: reviews.rows,
        reviewCount,
      }));
    }

    apiCalls();
  }, [state, displayOptions.limit, displayOptions.sorting]);

  //поиск обзоров при изменении страницы
  useEffect(() => {
    console.log("ass2");
    async function apiCalls() {
      const reviews = await getReviews({
        id,
        limit: displayOptions.limit.value,
        page: page,
        sorting: displayOptions.sorting.value,
      });
      const reviewCount = await countReviews(id);

      await setProductElem((oldProduct) => ({
        ...oldProduct,
        reviews: reviews.rows,
        reviewCount,
      }));
    }

    renderedOnce && apiCalls();
  }, [page]);

  console.log("PP types: " + JSON.stringify(product.types));
  return (
    productElem.img &&
    renderedOnce && (
      <div className="product-page-main-container">
        {productElem.type && (
          <div className="product-page-group-and-type">
            <Link
              to={SHOP_ROUTE}
              onClick={() =>
                setProduct((oldProduct) => ({
                  ...oldProduct,
                  selectedType: {},
                  selectedGroup: {},
                  name: "",
                }))
              }
              className="product-page-catalogue"
            >
              Каталог
            </Link>
            <div>{">"}</div>
            <Link
              to={GROUP_TYPES_ROUTE + `/${productElem.group.id}`}
              className="product-page-group"
            >
              {productElem.group.name}
            </Link>
            <div>{">"}</div>
            <Link
              to={SHOP_ROUTE}
              onClick={() =>
                setProduct((oldProduct) => ({
                  ...oldProduct,
                  selectedType: productElem.type,
                }))
              }
              className="product-page-type"
            >
              {productElem.type.name}
            </Link>
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
                          ? {
                              border:
                                "1px solid var(--navbar-background-color)",
                            }
                          : { border: "1px solid transparent" }
                      }
                      onClick={() => setCurrentSelection(index)}
                    />
                  );
                })}
              </div>
              <div className="product-page-img-container">
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
                {productElem.isHyped && (
                  <img className="product-hit-icon" src="/assets/hit.png" />
                )}
              </div>
            </div>
          </div>

          <div className="product-page-rating-container">
            <div className="product-page-rating-stars-and-stuff">
              <div>
                {starsArr.map((star) => {
                  return (
                    <img
                      key={star}
                      className="product-rating-star-icon"
                      src={
                        star <= productElem.rating
                          ? "/assets/fratingstar.png"
                          : star - 1 < productElem.rating
                          ? "/assets/hratingstar.png"
                          : "/assets/eratingstar.png"
                      }
                    />
                  );
                })}
              </div>
              <div>
                {productElem.rating
                  ? `${productElem.rating} / 5`
                  : `Нет отзывов`}
              </div>
            </div>
            <div>
              {starsArr.map((starCount) => (
                <div className="product-page-stars-and-count">
                  <div>
                    {starsArr.map((star) => (
                      <img
                        key={star}
                        className="product-rating-star-icon"
                        src={
                          star <= starCount
                            ? "/assets/fratingstar.png"
                            : "/assets/eratingstar.png"
                        }
                      />
                    ))}
                  </div>
                  <div>
                    {productElem.reviewCount.reviews
                      ? productElem.reviewCount.reviews.find(
                          (review) => review.rating === starCount
                        )
                        ? productElem.reviewCount.reviews.find(
                            (review) => review.rating === starCount
                          ).count == 1
                          ? "1 отзыв"
                          : productElem.reviewCount.reviews.find(
                              (review) => review.rating === starCount
                            ).count + "отзывов"
                        : "0 отзывов"
                      : "0 отзывов"}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="productElem-page-add-to-card-container">
            <div className="product-price-and-discount">
              {productElem.discount && productElem.discount !== 1 && (
                <div className="discounted-price">
                  {Math.ceil(productElem.price * productElem.discount)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                  &#x20BD;
                </div>
              )}
              <div
                className="product-oldPrice"
                style={
                  productElem.discount && productElem.discount !== 1
                    ? { textDecoration: "line-through", fontSize: "0.8rem" }
                    : {}
                }
              >
                {productElem.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                &#x20BD;
              </div>
              <div className="product-left-container">
                <img
                  className="product-left-icon"
                  src={
                    productElem.left && productElem.left > 0
                      ? "/assets/checkmark.svg"
                      : "/assets/delete.png"
                  }
                />
                <div>
                  {productElem.left && productElem.left > 0
                    ? "В наличии"
                    : "Не в наличии"}
                </div>
              </div>
            </div>

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
                    await addToFavourite(id);
                  }
                  let favourite = await getFavouriteIds();
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
                className="product-option-container"
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
                          ? { opacity: 0, transition: "500ms opacity ease-in" }
                          : { opacity: 1 }
                        : isHoveredOver
                        ? { opacity: 1, transition: "500ms opacity ease-in" }
                        : {}
                    }
                    src="/assets/fheart.svg"
                  />
                </div>

                <div className="product-heart-text">Добавить в избранное</div>
              </div>
            )}

            <div
              onClick={async () => {
                if (product.cart.find((elem) => elem === Number(id))) {
                  await setProduct((oldProduct) => ({
                    ...oldProduct,
                    cart: oldProduct.cart.filter((elem) => elem !== Number(id)),
                  }));
                } else {
                  await setProduct((oldProduct) => ({
                    ...oldProduct,
                    cart: [...oldProduct.cart, Number(id)],
                  }));
                }
              }}
              className="product-option-container"
            >
              <img
                className="product-heart product-heart-empty"
                src="/assets/cart.svg"
              />
              <div>
                {product.cart.find((elem) => elem === Number(id))
                  ? "Убрать из корзины"
                  : "Добавить в корзину"}
              </div>
            </div>

            <div
              onClick={async () => {
                if (product.toCompare.find((elem) => elem === Number(id))) {
                  await setProduct((oldProduct) => ({
                    ...oldProduct,
                    toCompare: oldProduct.toCompare.filter(
                      (elem) => elem !== Number(id)
                    ),
                  }));
                } else {
                  await setProduct((oldProduct) => ({
                    ...oldProduct,
                    toCompare:
                      oldProduct.toCompare.length < 2
                        ? [...oldProduct.toCompare, Number(id)]
                        : oldProduct.toCompare.map((element, index) =>
                            index === 1 ? Number(id) : element
                          ),
                  }));
                  if (
                    product.toCompare.length === 1 ||
                    product.toCompare.length === 2
                  ) {
                    navigate(COMPARE_ROUTE);
                  }
                }
              }}
              className="product-option-container"
            >
              <img
                style={{
                  width: "30px",
                  height: "30px",
                }}
                className="compare-icon"
                src="/assets/scale.png"
              />
              <div>
                {product.toCompare.find((elem) => elem === Number(id))
                  ? "Добавлено в сравнение"
                  : "Сравнить"}
              </div>
            </div>
          </div>
        </div>
        <div className="product-page-bottom-container">
          <h2>Характеристики </h2>
          <div className="product-page-stats">
            {productElem.info.map((stat, index) => {
              return (
                <div
                  key={stat.id}
                  style={index % 2 === 1 ? { backgroundColor: "white" } : {}}
                  className="product-page-stat"
                >
                  {stat.key}: {stat.value}
                </div>
              );
            })}
          </div>

          <h2>Описание</h2>
          <div className="product-page-description">
            <p>{productElem.description}</p>
          </div>

          <div className="product-page-rating-options-container">
            <h2>Отзывы</h2>
            <div className="shop-main-container-top-option-container">
              <div
                onClick={() =>
                  whatIsShown !== "sorting"
                    ? setWhatIsShown("sorting")
                    : setWhatIsShown("")
                }
              >
                Сортировка:{" "}
                <span>{displayOptions.sorting.text.toLowerCase()}</span>
              </div>
              <img
                style={
                  whatIsShown !== "sorting"
                    ? { transform: "rotate(-270deg)" }
                    : { transform: "rotate(-90deg)" }
                }
                src="/assets/drop-down-arrow.svg"
                className="navbar-types-icon"
              />
              {whatIsShown === "sorting" && (
                <div className="shop-main-container-top-sorting-options">
                  {reviewSortingValues.map((elem) => (
                    <div
                      className="shop-main-container-top-option"
                      key={elem.value}
                      onClick={async () => {
                        await setWhatIsShown("");
                        await setDisplayOptions((oldDisplayOptions) => ({
                          ...oldDisplayOptions,
                          sorting: elem,
                        }));
                      }}
                    >
                      {elem.text}
                    </div>
                  ))}
                </div>
              )}
              <div className="shop-main-container-top-option-container">
                <div
                  onClick={() =>
                    whatIsShown !== "limit"
                      ? setWhatIsShown("limit")
                      : setWhatIsShown("")
                  }
                >
                  Показывать: <span>{displayOptions.limit.value}</span>
                </div>
                <img
                  style={
                    whatIsShown !== "limit"
                      ? { transform: "rotate(-270deg)" }
                      : { transform: "rotate(-90deg)" }
                  }
                  src="/assets/drop-down-arrow.svg"
                  className="navbar-types-icon"
                />
                {whatIsShown === "limit" && (
                  <div className="shop-main-container-top-sorting-options">
                    {reviewLimitValues.map((elem) => (
                      <div
                        className="shop-main-container-top-option"
                        key={elem.value}
                        onClick={async () => {
                          await setWhatIsShown("");
                          await setDisplayOptions((oldDisplayOptions) => ({
                            ...oldDisplayOptions,
                            limit: elem,
                          }));
                        }}
                      >
                        {elem.value}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {user.isAuth ? (
            <AddReview
              productElem={productElem}
              setProductElem={setProductElem}
              displayOptions={displayOptions}
            />
          ) : (
            <h3>Авторизуйтесь для того чтобы оставить отзыв</h3>
          )}
          {productElem.reviews.length > 0 ? (
            <div className="product-page-reviews">
              {productElem.reviews.map((reviewElem) => {
                return (
                  <Review
                    key={reviewElem.id}
                    productElem={productElem}
                    setProductElem={setProductElem}
                    reviewRating={reviewRatings.find(
                      (elem) => elem.reviewId === reviewElem.id
                    )}
                    id={reviewElem.id}
                    img={reviewElem.user.img}
                    text={reviewElem.text}
                    advantages={reviewElem.advantages}
                    disadvantages={reviewElem.disadvantages}
                    date={new Date(reviewElem.createdAt)}
                    rating={reviewElem.rating}
                    name={reviewElem.user.name}
                    diff={reviewElem.diff}
                    setReviewRatings={setReviewRatings}
                  />
                );
              })}
              <div className="product-page-pagination-container">
                <DefaultPagination
                  page={page}
                  setPage={setPage}
                  limit={displayOptions.limit.value}
                  totalCount={productElem.reviewCount.totalCount}
                />
              </div>
            </div>
          ) : (
            <h2>Отзывов пока нет!</h2>
          )}
        </div>
      </div>
    )
  );
}

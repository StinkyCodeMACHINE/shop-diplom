import react, { useState, useContext, useEffect } from "react";
import CreateGroup from "../components/AdminPanel/modals/CreateGroup";
import CreateType from "../components/AdminPanel/modals/CreateType";
import CreateBrand from "../components/AdminPanel/modals/CreateBrand";
import CreateProduct from "../components/AdminPanel/modals/CreateProduct";
import { Context } from "../App";
import {
  changeOrderStatus,
  countReviews,
  deleteBanner,
  deleteBrand,
  deleteGroup,
  deleteOrder,
  deleteProduct,
  deleteReview,
  deleteType,
  getAllOrders,
  getAllReviews,
  getBanners,
  getBrands,
  getBrandsWithLimit,
  getGroups,
  getGroupsWithLimit,
  getOrders,
  getProducts,
  getReviews,
  getTypes,
  getTypesWithLimit,
} from "../API/productAPI";
import {
  API_URL,
  BANNER_IMAGE_URL,
  BRAND_IMAGE_URL,
  GROUP_IMAGE_URL,
  productLimitValues,
  PRODUCT_IMAGE_URL,
  PRODUCT_ROUTE,
  TYPE_IMAGE_URL,
} from "../utils/consts";
import DefaultPagination from "../components/DefaultPagination";
import ChangeBrand from "../components/AdminPanel/modals/ChangeBrand";
import ChangeGroup from "../components/AdminPanel/modals/ChangeGroup";
import ChangeType from "../components/AdminPanel/modals/ChangeType";
import ChangeProduct from "../components/AdminPanel/modals/ChangeProduct";
import CreateBanner from "../components/AdminPanel/modals/CreateBanner";
import ChangeBanner from "../components/AdminPanel/modals/ChangeBanner";

export default function AdminPanel() {
  const { product, setProduct, setWhatIsShown, whatIsShown } =
    useContext(Context);
  const [options, setOptions] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [page, setPage] = useState(1);
  const [prevThing, setPrevThing] = useState({});
  const [limit, setLimit] = useState(5);
  const [selectedType, setSelectedType] = useState({});
  const [selectedBrand, setSelectedBrand] = useState({});
  const [displayed, setDisplayed] = useState({
    what: "",
    data: [],
    totalCount: 0,
  });

  // при изменении опций
  useEffect(() => {
    apiCalls(true);
  }, [options, searchValue, limit]);

  // при изменении страницы
  useEffect(() => {
    options !== "" && apiCalls(false);
  }, [page]);

  useEffect(() => {
    async function apiCalls() {
      const types = await getTypes();
      const brands = await getBrands();
      await setProduct((oldProduct) => ({ ...oldProduct, types, brands }));
    }

    apiCalls();
  }, []);

  const starsArr = [];
  for (let i = 0; i < 5; i++) {
    starsArr.push(i + 1);
  }

  async function apiCalls(isPageOne) {
    let dataArray;
    if (isPageOne) {
      await setPage(1);
    }

    switch (options) {
      case "groups":
        dataArray = await getGroupsWithLimit({
          limit,
          page: isPageOne ? 1 : page,
          name: searchValue,
        });
        await setDisplayed({
          what: "groups",
          data: dataArray.rows,
          totalCount: dataArray.count,
        });
        break;
    }
    switch (options) {
      case "types":
        dataArray = await getTypesWithLimit({
          limit,
          page: isPageOne ? 1 : page,
          name: searchValue,
        });
        await setDisplayed({
          what: "types",
          data: dataArray.rows,
          totalCount: dataArray.count,
        });
        break;
    }
    switch (options) {
      case "brands":
        dataArray = await getBrandsWithLimit({
          limit,
          page: isPageOne ? 1 : page,
          name: searchValue,
        });
        await setDisplayed({
          what: "brands",
          data: dataArray.rows,
          totalCount: dataArray.count,
        });
        break;
    }
    switch (options) {
      case "products":
        dataArray = await getProducts({
          limit,
          page: isPageOne ? 1 : page,
          name: searchValue,
        });
        await setDisplayed({
          what: "products",
          data: dataArray.rows,
          totalCount: dataArray.count,
        });
        break;
    }
    switch (options) {
      case "orders":
        let orders = await getAllOrders({ searchValue: searchValue });
        orders = orders.flatMap((elem) =>
          elem.orderProducts.length === 0 ? [] : elem
        );
        const totalCount = orders.length;
        let limitedOrders = [];

        //
        let offset = page * limit - limit;
        for (let i = offset; i < offset + limit && i < orders.length; i++) {
          limitedOrders.push(orders[i]);
        }

        //
        await setDisplayed({
          what: "orders",
          data: limitedOrders,
          totalCount,
        });
        break;
    }
    switch (options) {
      case "reviews":
        dataArray = await getAllReviews({
          limit,
          page: isPageOne ? 1 : page,
          searchValue: searchValue,
        });
        await setDisplayed({
          what: "reviews",
          data: dataArray.rows,
          totalCount: dataArray.count,
        });
        break;
    }
    switch (options) {
      case "banners":
        dataArray = await getBanners({
          searchValue: searchValue,
        });
        await setDisplayed({
          what: "banners",
          data: dataArray,
          totalCount: dataArray.length,
        });
        break;
    }
  }

  return (
    <>
      {whatIsShown !== "" &&
        whatIsShown !== "limit" &&
        whatIsShown !== "cart" &&
        whatIsShown !== "types" && (
          <div
            className="admin-page-modal-opacity"
            onClick={async (e) => {
              if (e.target.classList.contains("admin-page-modal-opacity")) {
                await setWhatIsShown("");
                await setPrevThing({});
              }
            }}
          >
            {whatIsShown === "brand" && (
              <CreateBrand
                limit={limit}
                page={page}
                setDisplayed={setDisplayed}
              />
            )}
            {whatIsShown === "group" && (
              <CreateGroup
                limit={limit}
                page={page}
                setDisplayed={setDisplayed}
              />
            )}
            {whatIsShown === "type" && (
              <CreateType
                limit={limit}
                page={page}
                setDisplayed={setDisplayed}
              />
            )}
            {whatIsShown === "product" && (
              <CreateProduct
                limit={limit}
                page={page}
                setDisplayed={setDisplayed}
              />
            )}
            {whatIsShown === "changeBrand" && (
              <ChangeBrand
                limit={limit}
                page={page}
                setDisplayed={setDisplayed}
                prevThing={prevThing}
              />
            )}
            {whatIsShown === "changeGroup" && (
              <ChangeGroup
                limit={limit}
                page={page}
                setDisplayed={setDisplayed}
                prevThing={prevThing}
              />
            )}
            {whatIsShown === "changeType" && (
              <ChangeType
                limit={limit}
                page={page}
                setDisplayed={setDisplayed}
                prevThing={prevThing}
              />
            )}
            {whatIsShown === "changeProduct" && (
              <ChangeProduct
                limit={limit}
                page={page}
                setDisplayed={setDisplayed}
                prevThing={prevThing}
              />
            )}
            {whatIsShown === "banner" && (
              <CreateBanner
                limit={limit}
                page={page}
                setDisplayed={setDisplayed}
              />
            )}
            {whatIsShown === "changeBanner" && (
              <ChangeBanner
                limit={limit}
                page={page}
                setDisplayed={setDisplayed}
                prevThing={prevThing}
                searchValue={searchValue}
              />
            )}
          </div>
        )}

      <div className="admin-page-main-container">
        <h2>Панель администратора</h2>
        <div className="admin-page-inner-container">
          <div className="admin-page-options">
            <div
              style={options === "groups" ? { color: "blue" } : {}}
              onClick={() =>
                options !== "groups" ? setOptions("groups") : setOptions("")
              }
              className="admin-page-option"
            >
              Группы
            </div>
            <div
              style={options === "types" ? { color: "blue" } : {}}
              onClick={() =>
                options !== "types" ? setOptions("types") : setOptions("")
              }
              className="admin-page-option"
            >
              Типы
            </div>
            <div
              style={options === "brands" ? { color: "blue" } : {}}
              onClick={() =>
                options !== "brands" ? setOptions("brands") : setOptions("")
              }
              className="admin-page-option"
            >
              Бренды
            </div>
            <div
              style={options === "products" ? { color: "blue" } : {}}
              onClick={() =>
                options !== "products" ? setOptions("products") : setOptions("")
              }
              className="admin-page-option"
            >
              Товары
            </div>
            <div
              style={options === "orders" ? { color: "blue" } : {}}
              onClick={() =>
                options !== "orders" ? setOptions("orders") : setOptions("")
              }
              className="admin-page-option"
            >
              Заказы
            </div>
            <div
              style={options === "reviews" ? { color: "blue" } : {}}
              onClick={() =>
                options !== "reviews" ? setOptions("reviews") : setOptions("")
              }
              className="admin-page-option"
            >
              Отзывы
            </div>
            <div
              style={options === "banners" ? { color: "blue" } : {}}
              onClick={() =>
                options !== "banners" ? setOptions("banners") : setOptions("")
              }
              className="admin-page-option"
            >
              Баннеры
            </div>
          </div>
          <div className="admin-page-options">
            {options === "groups" && (
              <div
                onClick={() => setWhatIsShown("group")}
                className="product-option-container"
              >
                <div className="product-heart-icon-container">
                  <img
                    className="product-heart product-heart-empty"
                    src="/assets/add.png"
                  />
                </div>

                <div className="product-heart-text">Добавить новую группу</div>
              </div>
            )}
            {options === "types" && (
              <div
                onClick={() => setWhatIsShown("type")}
                className="product-option-container"
              >
                <div className="product-heart-icon-container">
                  <img
                    className="product-heart product-heart-empty"
                    src="/assets/add.png"
                  />
                </div>

                <div className="product-heart-text">Добавить новый тип</div>
              </div>
            )}
            {options === "brands" && (
              <div
                onClick={() => setWhatIsShown("brand")}
                className="product-option-container"
              >
                <div className="product-heart-icon-container">
                  <img
                    className="product-heart product-heart-empty"
                    src="/assets/add.png"
                  />
                </div>

                <div className="product-heart-text">Добавить новый бренд</div>
              </div>
            )}
            {options === "products" && (
              <div
                onClick={() => setWhatIsShown("product")}
                className="product-option-container"
              >
                <div className="product-heart-icon-container">
                  <img
                    className="product-heart product-heart-empty"
                    src="/assets/add.png"
                  />
                </div>

                <div className="product-heart-text">Добавить новый товар</div>
              </div>
            )}
            {options === "banners" && (
              <div
                onClick={() => setWhatIsShown("banner")}
                className="product-option-container"
              >
                <div className="product-heart-icon-container">
                  <img
                    className="product-heart product-heart-empty"
                    src="/assets/add.png"
                  />
                </div>

                <div className="product-heart-text">Добавить новый баннер</div>
              </div>
            )}
          </div>
          {options !== "" && (
            <div className="admin-page-table">
              <div className="admin-page-search-container">
                <input
                  onChange={(e) => setSearchValue(e.target.value)}
                  value={searchValue}
                  placeholder={
                    options === "orders" ||
                    options === "reviews" ||
                    options === "banners"
                      ? "Введите id"
                      : "Введите название"
                  }
                  className="navbar-search-bar"
                  type="text"
                />
                <img
                  onClick={async () => {
                    await setSearchValue("");
                  }}
                  class="navbar-x-icon"
                  src="/assets/x.svg"
                />
              </div>

              <div className="shop-main-container-top-option-container">
                <div
                  onClick={() =>
                    whatIsShown !== "limit"
                      ? setWhatIsShown("limit")
                      : setWhatIsShown("")
                  }
                >
                  Показывать: <span>{limit}</span>
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
                    {productLimitValues.map((elem) => (
                      <div
                        key={elem.value}
                        onClick={() => {
                          setWhatIsShown("");
                          setLimit(elem.value);
                        }}
                      >
                        {elem.value}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {options === "groups" && displayed.what === "groups" && (
                <table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Название</th>
                      <th>Изображение</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.what === "groups" &&
                      displayed.data.length > 0 &&
                      displayed.data.map((elem) => (
                        <tr>
                          <td>{elem.id}</td>
                          <td>{elem.name}</td>
                          <td>
                            <img
                              className="admin-page-elem-img"
                              src={
                                elem.img
                                  ? API_URL + GROUP_IMAGE_URL + elem.img
                                  : "/assets/default-img.png"
                              }
                            />
                          </td>
                          <td>
                            <div
                              onClick={async () => {
                                await setPrevThing(elem);
                                await setWhatIsShown("changeGroup");
                              }}
                              className="product-option-container"
                            >
                              <div className="product-heart-icon-container">
                                <img
                                  style={{ width: "30px", height: "30px" }}
                                  className="product-heart product-heart-empty"
                                  src="/assets/settings.png"
                                />
                              </div>

                              <div className="product-heart-text">Изменить</div>
                            </div>
                          </td>
                          <td>
                            <div
                              onClick={async () => {
                                await deleteGroup({ id: elem.id });
                                const dataArray = await getGroupsWithLimit({
                                  limit,
                                  page: page,
                                });
                                await setDisplayed({
                                  what: "groups",
                                  data: dataArray.rows,
                                  totalCount: dataArray.count,
                                });
                              }}
                              className="product-option-container"
                            >
                              <div className="product-heart-icon-container">
                                <img
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    filter: "var(--cred-filter)",
                                  }}
                                  className="product-heart product-heart-empty"
                                  src="/assets/delete.png"
                                />
                              </div>

                              <div className="product-heart-text">Удалить</div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {options === "types" && (
                <table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Название</th>
                      <th>Изображение</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.what === "types" &&
                      displayed.data.length > 0 &&
                      displayed.data.map((elem) => (
                        <tr>
                          <td>{elem.id}</td>
                          <td>{elem.name}</td>
                          <td>
                            <img
                              className="admin-page-elem-img"
                              src={
                                elem.img
                                  ? API_URL + TYPE_IMAGE_URL + elem.img
                                  : "/assets/default-img.png"
                              }
                            />
                          </td>
                          <td>
                            <div
                              onClick={async () => {
                                await setPrevThing(elem);
                                await setWhatIsShown("changeType");
                              }}
                              className="product-option-container"
                            >
                              <div className="product-heart-icon-container">
                                <img
                                  style={{ width: "30px", height: "30px" }}
                                  className="product-heart product-heart-empty"
                                  src="/assets/settings.png"
                                />
                              </div>

                              <div className="product-heart-text">Изменить</div>
                            </div>
                          </td>
                          <td>
                            <div
                              onClick={async () => {
                                await deleteType({ id: elem.id });
                                const dataArray = await getTypesWithLimit({
                                  limit,
                                  page: page,
                                });
                                await setDisplayed({
                                  what: "types",
                                  data: dataArray.rows,
                                  totalCount: dataArray.count,
                                });
                              }}
                              className="product-option-container"
                            >
                              <div className="product-heart-icon-container">
                                <img
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    filter: "var(--cred-filter)",
                                  }}
                                  className="product-heart product-heart-empty"
                                  src="/assets/delete.png"
                                />
                              </div>

                              <div className="product-heart-text">Удалить</div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {options === "brands" && (
                <table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Название</th>
                      <th>Изображение</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.what === "brands" &&
                      displayed.data.length > 0 &&
                      displayed.data.map((elem) => (
                        <tr>
                          <td>{elem.id}</td>
                          <td>{elem.name}</td>
                          <td>
                            <img
                              className="admin-page-elem-img"
                              src={
                                elem.img
                                  ? API_URL + BRAND_IMAGE_URL + elem.img
                                  : "/assets/default-img.png"
                              }
                            />
                          </td>
                          <td>
                            <div
                              onClick={async () => {
                                await setPrevThing(elem);
                                await setWhatIsShown("changeBrand");
                              }}
                              className="product-option-container"
                            >
                              <div className="product-heart-icon-container">
                                <img
                                  style={{ width: "30px", height: "30px" }}
                                  className="product-heart product-heart-empty"
                                  src="/assets/settings.png"
                                />
                              </div>

                              <div className="product-heart-text">Изменить</div>
                            </div>
                          </td>
                          <td>
                            <div
                              onClick={async () => {
                                await deleteBrand({ id: elem.id });
                                const dataArray = await getBrandsWithLimit({
                                  limit,
                                  page: page,
                                });
                                await setDisplayed({
                                  what: "brands",
                                  data: dataArray.rows,
                                  totalCount: dataArray.count,
                                });
                              }}
                              className="product-option-container"
                            >
                              <div className="product-heart-icon-container">
                                <img
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    filter: "var(--cred-filter)",
                                  }}
                                  className="product-heart product-heart-empty"
                                  src="/assets/delete.png"
                                />
                              </div>

                              <div className="product-heart-text">Удалить</div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
              {options === "products" && (
                <table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Название</th>
                      <th>Цена</th>
                      <th>Скидка</th>
                      <th>Рейтинг</th>
                      <th>Популярность</th>
                      <th>Изображение</th>
                      <th>Описание</th>
                      <th>Количество</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.what === "products" &&
                      displayed.data.length > 0 &&
                      displayed.data.map((elem) => (
                        <tr>
                          <td>{elem.id}</td>
                          <td>{elem.name}</td>
                          <td>
                            <div className="admin-page-price">
                              {elem.price
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                              &#x20BD;
                            </div>
                          </td>
                          <td>
                            {elem.discount
                              ? Math.ceil((1 - elem.discount) * 100) + "%"
                              : "0%"}
                          </td>
                          <td>
                            <div className="admin-page-rating-stars-and-stuff">
                              <div>
                                {starsArr.map((star) => {
                                  return (
                                    <img
                                      key={star}
                                      className="product-rating-star-icon"
                                      src={
                                        star <= elem.rating
                                          ? "/assets/fratingstar.png"
                                          : star - 1 < elem.rating
                                          ? "/assets/hratingstar.png"
                                          : "/assets/eratingstar.png"
                                      }
                                    />
                                  );
                                })}
                              </div>
                              <div>
                                {elem.rating
                                  ? `${elem.rating} / 5`
                                  : `Нет отзывов`}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="admin-page-hype">
                              {elem.isHyped ? "Популярен" : "Непопулярен"}
                            </div>
                          </td>
                          <td>
                            <img
                              className="admin-page-elem-img"
                              src={
                                elem.img
                                  ? API_URL + PRODUCT_IMAGE_URL + elem.img[0]
                                  : "/assets/default-img.png"
                              }
                            />
                          </td>
                          <td>
                            <div className="admin-page-product-description">
                              {!elem.description
                                ? "Без описания"
                                : elem.description}
                            </div>
                          </td>
                          <td>
                            {elem.left ? elem.left : <span>&#8734;</span>}
                          </td>
                          <td>
                            <div
                              onClick={async () => {
                                await setPrevThing(elem);
                                await setWhatIsShown("changeProduct");
                              }}
                              className="product-option-container"
                            >
                              <div className="product-heart-icon-container">
                                <img
                                  style={{ width: "30px", height: "30px" }}
                                  className="product-heart product-heart-empty"
                                  src="/assets/settings.png"
                                />
                              </div>

                              <div className="product-heart-text">Изменить</div>
                            </div>
                          </td>
                          <td>
                            <div
                              onClick={async () => {
                                await deleteProduct({ id: elem.id });
                                const dataArray = await getProducts({
                                  limit,
                                  page: page,
                                });
                                await setDisplayed({
                                  what: "products",
                                  data: dataArray.rows,
                                  totalCount: dataArray.count,
                                });
                              }}
                              className="product-option-container"
                            >
                              <div className="product-heart-icon-container">
                                <img
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    filter: "var(--cred-filter)",
                                  }}
                                  className="product-heart product-heart-empty"
                                  src="/assets/delete.png"
                                />
                              </div>

                              <div className="product-heart-text">Удалить</div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {options === "orders" && (
                <>
                  {displayed.what === "orders" &&
                    displayed.data.length > 0 &&
                    displayed.data.map((orderElem) => (
                      <div className="orders-page-order-container">
                        <h3>Заказ № {orderElem.id}</h3>
                        {orderElem.orderProducts &&
                          orderElem.orderProducts.length > 0 &&
                          orderElem.orderProducts.map((orderProductElem) => {
                            return (
                              <>
                                <div
                                  key={orderProductElem.id}
                                  className="orders-page-product-container"
                                >
                                  <img
                                    onClick={() => {
                                      navigate(
                                        PRODUCT_ROUTE +
                                          "/" +
                                          orderProductElem.product.id,
                                        {
                                          state: nanoid(), //для ререндера той же страницы
                                        }
                                      );
                                      setWhatIsShown("");
                                    }}
                                    className="product-image"
                                    src={
                                      API_URL +
                                      PRODUCT_IMAGE_URL +
                                      orderProductElem.product.img[0]
                                    }
                                  />
                                  <div>{orderProductElem.product.name}</div>
                                  <div>
                                    <div>
                                      Цена:{" "}
                                      <span>
                                        {orderProductElem.price
                                          .toString()
                                          .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            " "
                                          )}
                                        &#x20BD;
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <div>
                                      Колво:{" "}
                                      <span>{orderProductElem.amount}</span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        <div className="order-results">
                          <div>
                            <div
                              onClick={async () => {
                                await changeOrderStatus({ id: orderElem.id });
                                let orders = await getAllOrders({
                                  name: searchValue,
                                });
                                orders = orders.flatMap((elem) =>
                                  elem.orderProducts.length === 0 ? [] : elem
                                );
                                const totalCount = orders.length;
                                let limitedOrders = [];

                                //
                                let offset = page * limit - limit;
                                for (
                                  let i = offset;
                                  i < offset + limit && i < orders.length;
                                  i++
                                ) {
                                  limitedOrders.push(orders[i]);
                                }

                                //
                                await setDisplayed({
                                  what: "orders",
                                  data: limitedOrders,
                                  totalCount,
                                });
                              }}
                              className="product-option-container"
                            >
                              <div className="product-heart-icon-container">
                                <img
                                  style={{ width: "30px", height: "30px" }}
                                  className="product-heart product-heart-empty"
                                  src="/assets/settings.png"
                                />
                              </div>

                              <div className="product-heart-text">
                                Изменить статус заказа
                              </div>
                            </div>

                            <div
                              onClick={async () => {
                                await deleteOrder({ id: orderElem.id });
                                let orders = await getAllOrders({
                                  name: searchValue,
                                });
                                orders = orders.flatMap((elem) =>
                                  elem.orderProducts.length === 0 ? [] : elem
                                );
                                const totalCount = orders.length;
                                let limitedOrders = [];

                                //
                                let offset = page * limit - limit;
                                for (
                                  let i = offset;
                                  i < offset + limit && i < orders.length;
                                  i++
                                ) {
                                  limitedOrders.push(orders[i]);
                                }

                                //
                                await setDisplayed({
                                  what: "orders",
                                  data: limitedOrders,
                                  totalCount,
                                });
                              }}
                              className="product-option-container"
                            >
                              <div className="product-heart-icon-container">
                                <img
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    filter: "var(--cred-filter)",
                                  }}
                                  className="product-heart product-heart-empty"
                                  src="/assets/delete.png"
                                />
                              </div>

                              <div className="product-heart-text">Удалить</div>
                            </div>
                          </div>
                          <div className="admin-panel-order-results">
                            <div>
                              Товаров:{" "}
                              {orderElem.orderProducts.reduce(
                                (totalAmount, elem) =>
                                  totalAmount + elem.amount,
                                0
                              )}
                            </div>
                            <div>
                              Сумма:{" "}
                              {orderElem.money
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                              &#x20BD;
                            </div>
                            <div>
                              Адрес: <span>{orderElem.address}</span>
                            </div>
                            <div>
                              Дата оформления:{" "}
                              {`${new Date(
                                orderElem.createdAt
                              ).getDate()}.${new Date(
                                orderElem.createdAt
                              ).getMonth()}.${new Date(
                                orderElem.createdAt
                              ).getFullYear()}`}
                            </div>
                            <div>
                              Статус:{" "}
                              <span>{orderElem.status.toLowerCase()}</span>
                            </div>
                            <div>Телефон: {orderElem.phone} </div>
                            <div>Адрес: {orderElem.address} </div>
                            <div>Почта: {orderElem.email}</div>
                            <div>ФИО: {orderElem.name}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </>
              )}

              {options === "reviews" &&
                displayed.what === "reviews" &&
                displayed.data.length > 0 && (
                  <table>
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Id товара</th>
                        <th>Преимущества</th>
                        <th>Недостатки</th>
                        <th>Тело отзыва</th>
                        <th>Оценка</th>
                        <th>Рейтинг</th>
                        <th>Дата отзыва</th>
                        <th>Имя пользователя</th>
                        <th>Почта пользователя</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayed.data.map((elem) => (
                        <tr>
                          <td>{elem.id}</td>
                          <td>{elem.productId}</td>
                          <td>
                            <div className="admin-page-review-text">
                              {elem.advantages}
                            </div>
                          </td>
                          <td>
                            <div className="admin-page-review-text">
                              {elem.disadvantages}
                            </div>
                          </td>
                          <td>
                            <div className="admin-page-review-text">
                              {elem.text}
                            </div>
                          </td>
                          <td>
                            <div className="product-rating-user-rating">
                              {starsArr.map((star) => {
                                return (
                                  <img
                                    key={star}
                                    className="product-rating-star-icon"
                                    src={
                                      star <= elem.rating
                                        ? "/assets/fratingstar.png"
                                        : "/assets/eratingstar.png"
                                    }
                                  />
                                );
                              })}
                            </div>
                          </td>
                          <td>{elem.diff}</td>
                          <td>{`${new Date(
                            elem.createdAt
                          ).getDate()}.${new Date(
                            elem.createdAt
                          ).getMonth()}.${new Date(
                            elem.createdAt
                          ).getFullYear()}`}</td>
                          <td>{elem.user.name}</td>
                          <td>{elem.user.email}</td>
                          <td>
                            <div
                              onClick={async () => {
                                const reviewCount = await countReviews(
                                  elem.productId
                                );
                                const deletedReview = await deleteReview({
                                  id: elem.id,
                                  reviewCount,
                                  rating: elem.rating,
                                });

                                const dataArray = await getAllReviews({
                                  limit,
                                  page,
                                  searchValue: searchValue,
                                });
                                await setDisplayed({
                                  what: "reviews",
                                  data: dataArray.rows,
                                  totalCount: dataArray.count,
                                });
                              }}
                              className="product-option-container"
                            >
                              <div className="product-heart-icon-container">
                                <img
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    filter: "var(--cred-filter)",
                                  }}
                                  className="product-heart product-heart-empty"
                                  src="/assets/delete.png"
                                />
                              </div>

                              <div className="product-heart-text">Удалить</div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

              {options === "banners" &&
                displayed.what === "banners" &&
                displayed.data.length > 0 && (
                  <table>
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Изображение</th>
                        <th>Бренд</th>
                        <th>Категория</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayed.data.map((elem) => (
                        <tr>
                          <td>{elem.id}</td>
                          <td>
                            <img
                              className="banner-img"
                              src={
                                elem.img
                                  ? API_URL + BANNER_IMAGE_URL + elem.img
                                  : "/assets/default-img.png"
                              }
                            />
                          </td>
                          <td>
                            {product.brands.find(
                              (brand) => brand.id === elem.brandId
                            )
                              ? product.brands.find(
                                  (brand) => brand.id === elem.brandId
                                ).name
                              : "Без бренда"}
                          </td>
                          <td>
                            {product.types.find(
                              (type) => type.id === elem.typeId
                            )
                              ? product.types.find(
                                  (type) => type.id === elem.typeId
                                ).name
                              : "Без категории"}
                          </td>
                          <td>
                            <div
                              onClick={async () => {
                                await setPrevThing(elem);
                                await setWhatIsShown("changeBanner");
                              }}
                              className="product-option-container"
                            >
                              <div className="product-heart-icon-container">
                                <img
                                  style={{ width: "30px", height: "30px" }}
                                  className="product-heart product-heart-empty"
                                  src="/assets/settings.png"
                                />
                              </div>

                              <div className="product-heart-text">Изменить</div>
                            </div>
                          </td>
                          <td>
                            <div
                              onClick={async () => {
                                await deleteBanner({
                                  id: elem.id,
                                  img: elem.img,
                                });
                                const dataArray = await getBanners({
                                  searchValue,
                                });
                                await setDisplayed({
                                  what: "banners",
                                  data: dataArray,
                                  totalCount: dataArray.length,
                                });
                              }}
                              className="product-option-container"
                            >
                              <div className="product-heart-icon-container">
                                <img
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    filter: "var(--cred-filter)",
                                  }}
                                  className="product-heart product-heart-empty"
                                  src="/assets/delete.png"
                                />
                              </div>

                              <div className="product-heart-text">Удалить</div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              {options !== "banners" && (
                <DefaultPagination
                  page={page}
                  setPage={setPage}
                  limit={limit}
                  totalCount={displayed.data.length > 0 && displayed.totalCount}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

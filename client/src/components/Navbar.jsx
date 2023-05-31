import react, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import {
  ADMIN_ROUTE,
  COMPARE_ROUTE,
  FAVOURITE_ROUTE,
  LOGIN_ROUTE,
  PRODUCT_ROUTE,
  SHOP_ROUTE,
} from "../utils/consts";
import { Context } from "../App";
import { getGroups, getProductsSearch, getTypes } from "../API/productAPI";
import Cart from "./Navbar/Cart";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, setUser, product, setProduct, whatIsShown, setWhatIsShown } =
    useContext(Context);
  const [searchValues, setSearchValues] = useState({
    name: "",
    type: {},
    searchResults: [],
  });

  useEffect(() => {
    async function apiCalls() {
      const types = product.types.length > 0 ? product.types : await getTypes();
      const groups =
        product.groups.length > 0 ? product.groups : await getGroups();
      await setProduct((oldProduct) => ({
        ...oldProduct,
        types,
        groups,
      }));
      console.log(`Navbar shit 1 types${JSON.stringify(product.types)}`);
    }

    apiCalls();
  }, []);

  function logOutHandler() {
    setUser({ user: {}, isAuth: false });
    localStorage.removeItem("token");
    navigate(SHOP_ROUTE);
  }

  async function onSubmitHandler() {
    await setProduct((oldProduct) => ({
      ...oldProduct,
      name: searchValues.name,
      selectedType:
        Object.keys(searchValues.type).length > 0 ? searchValues.type : {},
      selectedGroup:
        Object.keys(searchValues.type).length > 0
          ? product.groups.find(
              (group) => group.id === searchValues.type.groupId
            )
          : {},
      selectedBrand: {},
      sortingValue: {
        value: { byWhat: "", order: "DESC" },
        text: "Отсутствует",
      },
    }));
    await setSearchValues((oldSearchValues) => ({
      ...oldSearchValues,
      name: "",
    }));
    await setWhatIsShown("");
    navigate(SHOP_ROUTE);
  }

  async function clickTypesHandler(e) {
    if (Object.keys(searchValues.type).length !== 0) {
      await setSearchValues((oldSearchValues) => ({
        ...oldSearchValues,
        type: {},
      }));
      await setWhatIsShown("");
    } else {
      if (whatIsShown === "types") {
        await setSearchValues((oldSearchValues) => ({
          ...oldSearchValues,
        }));
        await setWhatIsShown("");
      } else {
        await setSearchValues((oldSearchValues) => ({
          ...oldSearchValues,
        }));
        await setWhatIsShown("types");
      }
    }
  }

  async function onSearchChangeHandler(e) {
    if (e.target.value.length > 0) {
      await setSearchValues((oldSearchValues) => ({
        ...oldSearchValues,
        name: e.target.value,
      }));

      await setWhatIsShown("results");

      const data = await getProductsSearch({
        limit: 10,
        name: e.target.value,
        typeId: searchValues.type.id,
      });

      setSearchValues((oldSearchValues) => ({
        ...oldSearchValues,
        searchResults: data.rows,
      }));
    } else {
      await setSearchValues((oldSearchValues) => ({
        ...oldSearchValues,
        name: "",
      }));
      setSearchValues((oldSearchValues) => ({
        ...oldSearchValues,
        searchResults: [],
      }));
    }
  }
  console.log("navbar product.favourite: ", JSON.stringify(product.favourite));
  console.log("navbar render types: " + JSON.stringify(product.types));

  return (
    <header className="navbar">
      <Link to={SHOP_ROUTE} onClick={(e) => setWhatIsShown("")}>
        Шазам
      </Link>
      <div className="navbar-search-bar-container">
        <div
          onClick={clickTypesHandler}
          className="navbar-search-bar-types-container"
        >
          <div>
            {Object.keys(searchValues.type).length === 0
              ? "Категории"
              : searchValues.type.name}
          </div>
          {Object.keys(searchValues.type).length === 0 ? (
            <img
              style={
                whatIsShown !== "types"
                  ? { transform: "rotate(-270deg)" }
                  : { transform: "rotate(-90deg)" }
              }
              className="navbar-types-icon"
              src="/assets/drop-down-arrow.svg"
            />
          ) : (
            <img className="navbar-types-icon-x" src="/assets/x.svg" />
          )}
        </div>
        <div className="navbar-search-bar-input-container">
          <input
            onChange={onSearchChangeHandler}
            value={searchValues.name}
            placeholder="Введите название товара"
            className="navbar-search-bar"
            type="text"
          />
          <img
            onClick={async () => {
              await setSearchValues((oldSearchValues) => ({
                ...oldSearchValues,
                name: "",
                searchResults: [],
              }));
              await setWhatIsShown("");
            }}
            className="navbar-x-icon"
            src={"/assets/x.svg"}
          />
          {whatIsShown === "results" && (
            <div className="navbar-search-bar-search-results">
              {searchValues.searchResults.map((searchResult) => {
                return (
                  <div
                    onClick={async () => {
                      await setSearchValues((oldSearchValues) => ({
                        ...oldSearchValues,
                        name: "",
                        searchResults: [],
                      }));
                      await setWhatIsShown("");
                      navigate(PRODUCT_ROUTE + `/${searchResult.id}`, {
                        state: nanoid(), //для ререндера той же страницы
                      });
                    }}
                    key={searchResult.name}
                    className="navbar-search-bar-search-result"
                  >
                    <span className="navbar-search-bar-search-result-type">
                      {
                        product.types.find(
                          (type) => type.id === searchResult.typeId
                        ).name
                      }
                    </span>{" "}
                    {searchResult.name}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          onClick={onSubmitHandler}
          className="navbar-search-bar-submit-button-container"
        >
          <div>Искать</div>
          <img
            className="navbar-search-icon"
            src="/assets/magnifying-glass.svg"
          />
        </div>

        {whatIsShown === "types" && (
          <div className="navbar-search-bar-types">
            {product.groups.map((group) =>
              product.types.find((type) => type.groupId === group.id) ? (
                <div key={group.name} className="navbar-search-bar-group">
                  <h2>{group.name}</h2>
                  <div>
                    {product.types.map((type) =>
                      type.groupId === group.id ? (
                        <div
                          onClick={async () => {
                            await setSearchValues((oldSearchValues) => ({
                              ...oldSearchValues,
                              type: type,
                            }));
                            await setWhatIsShown("");
                          }}
                          key={type.name}
                          className="navbar-search-bar-type"
                        >
                          {type.name}
                        </div>
                      ) : (
                        ""
                      )
                    )}
                  </div>
                </div>
              ) : (
                ""
              )
            )}
          </div>
        )}
      </div>
      {user.isAuth ? (
        <div className="navbar-options">
          {user.user.role === "ADMIN" && (
            <div onClick={() => navigate(ADMIN_ROUTE)}>АдминПанель</div>
          )}
          <div className="navbar-option-container">
            <div className="navbar-orders-text">Заказы</div>
            <img className="navbar-orders-icon" src="/assets/cart.svg" />
          </div>
          <div
            onClick={async () => await setWhatIsShown("cart")}
            className="navbar-option-container"
          >
            <div className="navbar-cart-text">Корзина</div>
            <div className="navbar-icon-counter-container">
              <img className="navbar-cart-icon" src="/assets/cart.svg" />
              <div className="navbar-favourite-count-container">
                {product.cart.length}
              </div>
            </div>
          </div>
          <div
            onClick={() => navigate(COMPARE_ROUTE)}
            className="navbar-compare-container"
          >
            <div className="navbar-cart-text">Сравнение</div>
            <div className="navbar-favourite-count-container">
              {product.toCompare.length}
            </div>
          </div>
          <div>{user.email}</div>

          <div
            onClick={() => navigate(FAVOURITE_ROUTE)}
            className="navbar-option-container"
          >
            <div className="navbar-favourite-text">Избранное</div>
            <div className="navbar-icon-counter-container">
              <img className="navbar-favourite-icon" src="/assets/fheart.svg" />
              <div className="navbar-favourite-count-container">
                {product.favourite.length}
              </div>
            </div>
          </div>

          <div className="navbar-name">
            {!user.user.name ? "Без имени" : user.user.name}
          </div>
          <div onClick={logOutHandler}>Выйти</div>
        </div>
      ) : (
        <div className="navbar-options">
          <div onClick={() => navigate(LOGIN_ROUTE)}>Авторизоваться</div>
        </div>
      )}

      {
        //тёмная штука
        (whatIsShown === "types" ||
          whatIsShown === "results" ||
          whatIsShown === "cart") && (
          <div
            onClick={() =>
              setWhatIsShown("")
            }
            className="navbar-modal-opacity"
          ></div>
        )
      }
      {whatIsShown === "cart" && <Cart />}
    </header>
  );
}

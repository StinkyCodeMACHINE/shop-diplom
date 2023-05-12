import react, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ADMIN_ROUTE,
  LOGIN_ROUTE,
  PRODUCT_ROUTE,
  SHOP_ROUTE,
} from "../utils/consts";
import { Context } from "../App";
import { getProductsSearch } from "../API/productAPI";

export default function Navbar() {
  const { user, setUser, setProduct, product } = useContext(Context);
  const [searchValues, setSearchValues] = useState({
    name: "",
    type: {},
    searchResults: [],
    whatIsShown: "",
  });
  const navigate = useNavigate();

  function logOutHandler() {
    setUser({ user: {}, isAuth: false });
    localStorage.removeItem("token");
    navigate(SHOP_ROUTE);
  }

  function onSubmitHandler() {
    setProduct((oldProduct) => ({
      ...oldProduct,
      name: searchValues.name,
      selectedType: searchValues.type ? searchValues.type : {},
    }));
    setSearchValues((oldSearchValues) => ({
      ...oldSearchValues,
      name: "",
      whatIsShown: ""
    }));
    console.log(product);
    navigate(SHOP_ROUTE);
  }

  async function clickTypesHandler(e) {
    Object.keys(searchValues.type).length !== 0
      ? await setSearchValues((oldSearchValues) => ({
          ...oldSearchValues,
          whatIsShown: "",
          type: {},
        }))
      : searchValues.whatIsShown === "types"
        ? await setSearchValues((oldSearchValues) => ({
            ...oldSearchValues,
            whatIsShown: "",
          }))
        : await setSearchValues((oldSearchValues) => ({
            ...oldSearchValues,
            whatIsShown: "types",
          }));
  }

  async function onSearchChangeHandler(e) {
    if (e.target.value.length > 0) {
      await setSearchValues((oldSearchValues) => ({
        ...oldSearchValues,
        name: e.target.value,
        whatIsShown: "results",
      }));

      console.log("type: " + JSON.stringify(searchValues.type))
      const data = await getProductsSearch(10, e.target.value, searchValues.type.id);

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

  return (
    <header className="navbar">
      <Link to={SHOP_ROUTE}>КупиДевайс</Link>
      <div className="navbar-search-bar-container">
        <div
          onClick={clickTypesHandler}
          className="navbar-search-bar-types-container"
        >
          {console.log(
            `type = ${searchValues.type} name: ${searchValues.type.name}`
          )}

          <div>
            {Object.keys(searchValues.type).length === 0
              ? "Категории"
              : searchValues.type.name}
          </div>
          {Object.keys(searchValues.type).length === 0 ? (
            <img
              style={
                searchValues.whatIsShown !== "types"
                  ? { transform: "rotate(90deg)" }
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
              }));
              setSearchValues((oldSearchValues) => ({
                ...oldSearchValues,
                searchResults: [],
              }));
            }}
            className="navbar-x-icon"
            src={"/assets/x.svg"}
          />
          {searchValues.whatIsShown === "results" && (
            <div className="navbar-search-bar-search-results">
              {searchValues.searchResults.map((searchResult) => {
                console.log(searchResult);
                return (
                  <div
                    onClick={async () => {
                      navigate(PRODUCT_ROUTE + `/${searchResult.id}`);
                      await setSearchValues((oldSearchValues) => ({
                        ...oldSearchValues,
                        name: "",
                        searchResults: [],
                        whatIsShown: "",
                      }));
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

        {searchValues.whatIsShown === "types" && (
          <div className="navbar-search-bar-types">
            {product.types.map((type) => {
              return (
                <div
                  onClick={async () => {
                    await setSearchValues((oldSearchValues) => ({
                      ...oldSearchValues,
                      type: type,
                      whatIsShown: "",

                    }))
                  }
                    
                  }
                  key={type.name}
                  className="navbar-search-bar-type"
                >
                  {type.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {user.isAuth ? (
        <div className="navbar-options">
          {user.user.role === "ADMIN" && (
            <div onClick={() => navigate(ADMIN_ROUTE)}>Админ</div>
          )}
          <img className="navbar-cart-icon" src="/assets/cart.svg" />
          <div>{user.email}</div>
          <div>Избранное</div>
          <div onClick={logOutHandler}>Выйти</div>
        </div>
      ) : (
        <div className="navbar-options">
          <div onClick={() => navigate(LOGIN_ROUTE)}>Авторизоваться</div>
        </div>
      )}

      {
        searchValues.whatIsShown && (
          <div
            onClick={() =>
              setSearchValues((oldSearchValues) => ({
                ...oldSearchValues,
                whatIsShown: "",
              }))
            }
            className="navbar-modal-opacity"
          ></div>
        ) //тёмная штука
      }
    </header>
  );
}

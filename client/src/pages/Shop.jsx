import react, { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";
import { API_URL, PRODUCT_ROUTE, PRODUCT_IMAGE_URL } from "../utils/consts";
import {
  getBrands,
  getFavouriteIds,
  getGroups,
  getProducts,
  getTypes,
} from "../API/productAPI";
import Pagination from "../components/Shop/Pagination";
import ProductCard from "../components/Shop/ProductCard";

export default function Shop() {
  const { product, setProduct, user, whatIsShown, setWhatIsShown } =
    useContext(Context);
  const sortingValues = [
    { value: { byWhat: "", order: "DESC" }, text: "Отсутствует" },
    { value: { byWhat: "price", order: "ASC" }, text: "Сначала недорогие" },
    { value: { byWhat: "price", order: "DESC" }, text: "Сначала дорогие" },
    // { value: {byWhat: "", order: "DESC"}, text: "Сначала популярные" },
    { value: {byWhat: "discount", order: "DESC"}, text: "По скидке" },
    // { value: {byWhat: "", order: "DESC"}, text: "Сначала обсуждаемые" },
    {
      value: { byWhat: "rating", order: "DESC" },
      text: "Сначала с лучшей оценкой",
    },
  ];
  const limitValues = [
    {value: 5},
    {value: 10},
    {value: 15},
    {value: 20}
  ];
  const [renderedOnce, setRenderedOnce] = useState(false);

  // const [product.sortingValue, setSortingValue] = useState(sortingValues[0]);

  // при изменении юзера
  useEffect(() => {
    async function apiCalls() {
      const result = {};
      result.types = await getTypes();
      result.brands = await getBrands();
      result.groups = await getGroups();
      result.favourite = user.user.id
        ? await getFavouriteIds(user.user.id)
        : [];
      await setProduct((oldProduct) => ({
        ...oldProduct,
        types: result.types,
        brands: result.brands,
        groups: result.groups,
        favourite: result.favourite,
      }));
      console.log(
        "1 useeffect бренды типы и фавориты product: " +
          JSON.stringify(product, null, 2)
      );
      console.log(
        "1 useeffect бренды типы и фавориты user: " +
          JSON.stringify(user, null, 2)
      );
    }

    apiCalls();

    console.log("1 useeffect бренды типы и фавориты");
  }, [user]);

  //изменение пагинации
  useEffect(() => {
    async function apiCalls() {
      let data = await getProducts({
        typeId: product.selectedType.id,
        brandId: product.selectedBrand.id,
        page: product.page,
        limit: product.limit,
        name: product.name,
        sorting: product.sortingValue.value,
      });
      await setProduct((oldProduct) => ({
        ...oldProduct,
        products: data.rows,
        totalCount: data.count,
      }));
    }

    apiCalls();

    console.log("2 useeffect селбренды селтипы и пейдж и имя");
  }, [product.page, product.limit]);

  //при смене выбранного типа, бренда или требуемого названия
  useEffect(() => {
    async function apiCalls() {
      let data = await getProducts({
        typeId: product.selectedType.id,
        brandId: product.selectedBrand.id,
        page: 1,
        limit: product.limit,
        name: product.name,
        sorting: product.sortingValue.value,
      });
      await setProduct((oldProduct) => ({
        ...oldProduct,
        products: data.rows,
        totalCount: data.count,
        page: 1,
      }));
    }
    renderedOnce && apiCalls();
    setRenderedOnce(true);

    console.log("3 useeffect селбренды селтипы");
  }, [product.selectedBrand, product.selectedType, product.name, product.sortingValue]);

  return (
    <div className="shop-container">
      {renderedOnce && (
        <>
          <div className="types">
            <h2>Категории</h2>
            {Object.keys(product.selectedGroup).length === 0 ? (
              <>
                {product.groups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() =>
                      setProduct((oldProduct) => ({
                        ...oldProduct,
                        selectedGroup: group,
                      }))
                    }
                  >
                    {group.name}
                  </div>
                ))}
              </>
            ) : (
              <>
                <div
                  onClick={() => {
                    setProduct((oldProduct) => ({
                      ...oldProduct,
                      selectedGroup: {},
                      selectedType: {},
                    }));
                  }}
                >
                  {"< " + product.selectedGroup.name}
                </div>
                {product.types.map((type) =>
                  type.groupId === product.selectedGroup.id ? (
                    <div
                      key={type.id}
                      style={
                        type.id === product.selectedType.id
                          ? { color: "blue" }
                          : {}
                      }
                      onClick={() =>
                        product.selectedType.id === type.id
                          ? setProduct((oldProduct) => ({
                              ...oldProduct,
                              selectedType: {},
                            }))
                          : setProduct((oldProduct) => ({
                              ...oldProduct,
                              selectedType: type,
                            }))
                      }
                    >
                      {type.name}
                    </div>
                  ) : (
                    ""
                  )
                )}
              </>
            )}
          </div>
          <div className="main-container">
            <div className="shop-main-container-top-options">
              <h2>
                {product.name
                  ? "Результаты поиска по запросу: " + product.name
                  : Object.keys(product.selectedType).length > 0
                  ? product.selectedType.name
                  : "Каталог"}
              </h2>
              <div className="shop-main-container-top-option-container">
                <div
                  onClick={() =>
                    whatIsShown !== "sorting"
                      ? setWhatIsShown("sorting")
                      : setWhatIsShown("")
                  }
                >
                  Сортировка:{" "}
                  <span>{product.sortingValue.text.toLowerCase()}</span>
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
                    {sortingValues.map((elem) => (
                      <div
                        key={elem.value}
                        onClick={() => {
                          setWhatIsShown("");
                          setProduct((oldProduct) => ({
                            ...oldProduct,
                            sortingValue: elem,
                          }));
                        }}
                      >
                        {elem.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="shop-main-container-top-option-container">
                <div
                  onClick={() =>
                    whatIsShown !== "limit"
                      ? setWhatIsShown("limit")
                      : setWhatIsShown("")
                  }
                >
                  Показывать: <span>{product.limit}</span>
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
                    {limitValues.map((elem) => (
                      <div
                        key = {elem.value}
                        onClick={() => {
                          setWhatIsShown("");
                          setProduct((oldProduct) => ({
                            ...oldProduct,
                            limit: elem.value,
                          }));
                        }}
                      >
                        {elem.value}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* <div className="shop-main-container-top-grouping">
                <div>
                  Группировка: <span></span>
                </div>
                <img
                  style={
                    whatIsShown !== "types"
                      ? { transform: "rotate(-270deg)" }
                      : { transform: "rotate(-90deg)" }
                  }
                  src="/assets/drop-down-arrow.svg"
                  className="navbar-types-icon"
                />
                <div>
                  <ul>
                    <li>Сначала недорогие</li>
                    <li>Сначала дорогие</li>
                    <li>Сначала популярные</li>
                    <li>По скидке</li>
                    <li>Сначала обсуждаемые</li>
                    <li>Сначала с лучшей оценкой</li>
                  </ul>
                </div>
              </div> */}
            </div>

            <div className="brands">
              {product.brands.map((eachBrand) => (
                <div
                  key={eachBrand.id}
                  style={
                    eachBrand.id === product.selectedBrand.id
                      ? { color: "blue" }
                      : {}
                  }
                  onClick={() =>
                    product.selectedBrand.id === eachBrand.id
                      ? setProduct((oldProduct) => ({
                          ...oldProduct,
                          selectedBrand: {},
                        }))
                      : setProduct((oldProduct) => ({
                          ...oldProduct,
                          selectedBrand: eachBrand,
                        }))
                  }
                >
                  {eachBrand.name}
                </div>
              ))}
            </div>
            {product.types.length > 0 && product.brands.length > 0 && (
              <div className="product-cards">
                {product.products.map((eachProduct) => (
                  <ProductCard
                    key={eachProduct.id}
                    id={eachProduct.id}
                    typeId={eachProduct.typeId}
                    brandId={eachProduct.brandId}
                    img={eachProduct.img}
                    rating={eachProduct.rating}
                    name={eachProduct.name}
                    price={eachProduct.price}
                  />
                ))}
              </div>
            )}

            <Pagination />
          </div>
        </>
      )}
    </div>
  );
}

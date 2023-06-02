import react, { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";
import {
  API_URL,
  PRODUCT_ROUTE,
  PRODUCT_IMAGE_URL,
  productSortingValues,
  productLimitValues,
} from "../utils/consts";
import {
  getBrands,
  getDefaultTypeInfo,
  getFavouriteIds,
  getGroups,
  getInstances,
  getProducts,
  getTypes,
} from "../API/productAPI";
import Pagination from "../components/Shop/Pagination";
import ProductCard from "../components/Shop/ProductCard";

export default function Shop() {
  const { product, setProduct, user, whatIsShown, setWhatIsShown } =
    useContext(Context);
  const [renderedOnce, setRenderedOnce] = useState({ pageOne: false });
  const [inputValues, setInputValues] = useState({
    priceLowerLimit: "",
    priceUpperLimit: "",
    inStock: false,
  });
  const [applyShown, setApplyShown] = useState(false);
  const [defaultInfo, setDefaultInfo] = useState([]);
  const [infoInstances, setInfoInstances] = useState([]);
  const [selectedInfoInstance, setSelectedInfoInstance] = useState({});

  // const [product.sortingValue, setSortingValue] = useState(productSortingValues[0]);

  // при изменении юзера
  useEffect(() => {
    async function apiCalls() {
      const result = {};
      result.types = await getTypes();
      result.brands = await getBrands();
      result.groups = await getGroups();
      result.favourite = user.user.id ? await getFavouriteIds() : [];
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
        inStock: inputValues.inStock,
        priceRange: {
          priceLowerLimit: inputValues.priceLowerLimit,
          priceUpperLimit: inputValues.priceUpperLimit,
        },
        selectedInfoInstance:
          Object.keys(selectedInfoInstance).length > 0
            ? {
                value: selectedInfoInstance.value,
                typeDefaultInfoId: selectedInfoInstance.typeDefaultInfoId,
              }
            : {},
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
        inStock: inputValues.inStock,
        priceRange: {
          priceLowerLimit: inputValues.priceLowerLimit,
          priceUpperLimit: inputValues.priceUpperLimit,
        },
        selectedInfoInstance:
          Object.keys(selectedInfoInstance).length > 0
            ? {
                value: selectedInfoInstance.value,
                typeDefaultInfoId: selectedInfoInstance.typeDefaultInfoId,
              }
            : {},
      });

      await setProduct((oldProduct) => ({
        ...oldProduct,
        products: data.rows,
        totalCount: data.count,
        page: 1,
      }));
    }
    renderedOnce.pageOne && apiCalls();
    setRenderedOnce((oldRenderedOnce) => ({
      ...oldRenderedOnce,
      pageOne: true,
    }));

    console.log("3 useeffect селбренды селтипы");
  }, [
    product.selectedBrand,
    product.selectedType,
    product.name,
    product.sortingValue,
    product.limit,
    selectedInfoInstance,
    inputValues.inStock,
  ]);

  // обновление списка дефолт инфы
  useEffect(() => {
    async function apiCalls() {
      const typeInfo = await getDefaultTypeInfo(product.selectedType.id);
      await setDefaultInfo(typeInfo);
    }

    Object.keys(product.selectedType).length > 0 && apiCalls();
  }, [product.selectedType]);

  // поиск соответствий по дефолтным характеристикам
  useEffect(() => {
    async function apiCalls() {
      const data = await Promise.all(
        defaultInfo.map(async (infoElem) => {
          let infoInstances = await getInstances(infoElem.id);
          // infoInstances = infoInstances.sort((a, b) => b.count - a.count);
          return {
            stat: infoElem,
            values: infoInstances,
            hidden: true,
          };
        })
      );
      console.log("data: " + JSON.stringify(data, null, 2));
      await setInfoInstances(data);
    }

    defaultInfo.length > 0 && apiCalls();
  }, [defaultInfo]);

  async function applyPriceLimits() {
    let products = {};
    if (
      inputValues.priceLowerLimit &&
      inputValues.priceUpperLimit &&
      inputValues.priceLowerLimit > inputValues.priceUpperLimit
    ) {
      await setInputValues((oldInputValues) => ({
        priceLowerLimit: oldInputValues.priceUpperLimit,
        priceUpperLimit: oldInputValues.priceLowerLimit,
      }));
      products = await getProducts({
        typeId: product.selectedType.id,
        brandId: product.selectedBrand.id,
        page: 1,
        limit: product.limit,
        name: product.name,
        sorting: product.sortingValue.value,
        inStock: inputValues.inStock,
        priceRange: {
          priceLowerLimit: inputValues.priceUpperLimit,
          priceUpperLimit: inputValues.priceLowerLimit,
        },
        selectedInfoInstance:
          Object.keys(selectedInfoInstance).length > 0
            ? {
                value: selectedInfoInstance.value,
                typeDefaultInfoId: selectedInfoInstance.typeDefaultInfoId,
              }
            : {},
      });
    } else {
      products = await getProducts({
        typeId: product.selectedType.id,
        brandId: product.selectedBrand.id,
        page: 1,
        limit: product.limit,
        name: product.name,
        sorting: product.sortingValue.value,
        inStock: inputValues.inStock,
        priceRange: {
          priceLowerLimit: inputValues.priceLowerLimit,
          priceUpperLimit: inputValues.priceUpperLimit,
        },
        selectedInfoInstance:
          Object.keys(selectedInfoInstance).length > 0
            ? {
                value: selectedInfoInstance.value,
                typeDefaultInfoId: selectedInfoInstance.typeDefaultInfoId,
              }
            : {},
      });
    }

    await setApplyShown(false);
    await setProduct((oldProduct) => ({
      ...oldProduct,
      products: products.rows,
      totalCount: products.count,
    }));
  }

  async function resetPriceLimits(what) {
    await setInputValues((oldInputValues) => ({
      priceLowerLimit: what === 1 ? "" : oldInputValues.priceLowerLimit,
      priceUpperLimit: what === 2 ? "" : oldInputValues.priceUpperLimit,
    }));
    const products = await getProducts({
      typeId: product.selectedType.id,
      brandId: product.selectedBrand.id,
      page: 1,
      limit: product.limit,
      name: product.name,
      sorting: product.sortingValue.value,
      inStock: inputValues.inStock,
      priceRange: {
        priceLowerLimit: "",
        priceUpperLimit: "",
      },
    });
    await setApplyShown(false);
    await setProduct((oldProduct) => ({
      ...oldProduct,
      products: products.rows,
      totalCount: products.count,
    }));
  }

  return (
    <div className="shop-container">
      {renderedOnce.pageOne && (
        <>
          <div>
            <div className="shop-side-options">
              <h2>Категории</h2>
              <div className="shop-side-options-types">
                {Object.keys(product.selectedGroup).length === 0 ? (
                  <>
                    {product.groups.length > 0 &&
                      product.types.length > 0 &&
                      product.groups.map((group) =>
                        product.types.find(
                          (type) => type.groupId == group.id
                        ) ? (
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
                        ) : (
                          ""
                        )
                      )}
                  </>
                ) : (
                  <>
                    <div
                      onClick={async () => {
                        await setProduct((oldProduct) => ({
                          ...oldProduct,
                          selectedGroup: {},
                          selectedType: {},
                        }));
                        await setSelectedInfoInstance({});
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
                          onClick={async () => {
                            if (product.selectedType.id === type.id) {
                              await setProduct((oldProduct) => ({
                                ...oldProduct,
                                selectedType: {},
                              }));
                              await setSelectedInfoInstance({});
                            } else {
                              await setProduct((oldProduct) => ({
                                ...oldProduct,
                                selectedType: type,
                              }));
                            }
                          }}
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

              {/* заменить на в наличие и галочку */}
              <h2>Бренды</h2>
              <div className="shop-side-options-brands">
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
              <h2>Наличие</h2>
              <input
                onChange={() =>
                  setInputValues((oldInputValues) => ({
                    ...oldInputValues,
                    inStock: !oldInputValues.inStock,
                  }))
                }
                checked={inputValues.inStock}
                id="inStock"
                type="checkbox"
              />
              <label htmlFor="inStock">В наличие?</label>
              <h2>Цена</h2>
              <div className="shop-side-options-price">
                <div className="shop-side-options-price-fields">
                  <input
                    onChange={async (e) => {
                      await setInputValues((oldInputValues) => ({
                        ...oldInputValues,
                        priceLowerLimit: e.target.value,
                      }));
                      await setApplyShown(true);
                    }}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    value={inputValues.priceLowerLimit}
                    type="number"
                    min="1"
                    placeholder="от"
                  />
                  <img
                    onClick={() => resetPriceLimits(1)}
                    class="shop-side-options-price-x"
                    src="/assets/x.svg"
                  />
                </div>
                <div className="shop-side-options-price-fields">
                  <input
                    onChange={async (e) => {
                      await setInputValues((oldInputValues) => ({
                        ...oldInputValues,
                        priceUpperLimit: e.target.value,
                      }));
                      await setApplyShown(true);
                    }}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    value={inputValues.priceUpperLimit}
                    type="number"
                    min="1"
                    placeholder="до"
                  />
                  <img
                    onClick={() => resetPriceLimits(2)}
                    class="shop-side-options-price-x"
                    src="/assets/x.svg"
                  />
                </div>
                {applyShown && (
                  <div className="shop-side-options-apply">
                    <div className="shop-side-options-apply-triangle"></div>
                    <div onClick={applyPriceLimits}>Применить</div>
                  </div>
                )}
              </div>

              {Object.keys(product.selectedType).length > 0 &&
                !product.name && (
                  <>
                    <h2>Характеристики</h2>
                    <div className="shop-side-options-stats">
                      {infoInstances.length > 0 &&
                        infoInstances.map((instanceElem) => (
                          <div key={instanceElem.id}>
                            <div
                              onClick={async () => {
                                await setInfoInstances((oldInfoInstances) => {
                                  const array = oldInfoInstances.map(
                                    (instanceElem) => ({ ...instanceElem })
                                  );
                                  const index = array.findIndex(
                                    (elem) =>
                                      elem.stat.id === instanceElem.stat.id
                                  );
                                  array[index].hidden = !array[index].hidden;
                                  return array;
                                });

                                !instanceElem.hidden &&
                                  selectedInfoInstance.typeDefaultInfoId ===
                                    instanceElem.values[0].typeDefaultInfoId &&
                                  (await setSelectedInfoInstance({}));
                              }}
                              className="shop-side-options-stats-stat"
                            >
                              <img
                                style={
                                  instanceElem.hidden
                                    ? { transform: "rotate(-270deg)" }
                                    : { transform: "rotate(-90deg)" }
                                }
                                src="/assets/drop-down-arrow.svg"
                              />
                              <h3>{instanceElem.stat.key}</h3>
                            </div>
                            <div
                              className="shop-side-options-stats-stat-instance"
                              style={
                                instanceElem.hidden
                                  ? {
                                      transform: "scaleY(0)",
                                      maxHeight: "0px",
                                      opacity: 0,
                                    }
                                  : {
                                      transform: "scaleY(1)",
                                      height: "auto",
                                      maxHeight: "50px",
                                      opacity: 1,
                                    }
                              }
                            >
                              {instanceElem.values.map((value) => (
                                <div
                                  key={value.value}
                                  style={
                                    selectedInfoInstance.value ===
                                      value.value &&
                                    selectedInfoInstance.typeDefaultInfoId ===
                                      value.typeDefaultInfoId
                                      ? { color: "blue" }
                                      : {}
                                  }
                                  onClick={() => {
                                    if (
                                      selectedInfoInstance.value ===
                                        value.value &&
                                      selectedInfoInstance.typeDefaultInfoId ===
                                        value.typeDefaultInfoId
                                    ) {
                                      setSelectedInfoInstance({});
                                    } else {
                                      setSelectedInfoInstance(value);
                                    }
                                  }}
                                >
                                  {value.value} <span>({value.count})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                )}
            </div>
          </div>

          <div className="main-container">
            <div className="shop-main-container-top-options">
              <h2>
                {product.name
                  ? `${product.totalCount} результат${
                      product.totalCount === 1 ? "" : "ов"
                    } по запросу: ${product.name}`
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
                    {productSortingValues.map((elem) => (
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
                    {productLimitValues.map((elem) => (
                      <div
                        key={elem.value}
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

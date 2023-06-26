import react, { useState, useEffect, useContext } from "react";
import {
  createProduct,
  getTypes,
  getBrands,
  getDefaultTypeInfo,
  getProducts,
} from "../../../API/productAPI";
import { Context } from "../../../App";
import { nanoid } from "nanoid";

export default function CreateProduct({ setDisplayed, page, limit }) {
  const { product, setProduct, whatIsShown, setWhatIsShown } =
    useContext(Context);
  const [newSrc, setNewSrc] = useState("");

  const [inputValues, setInputValues] = useState({
    name: "",
    price: 1,
    files: null,
    brand: "",
    type: "",
    description: "",
    left: 0,
    discount: 0,
    isHyped: false,
  });

  useEffect(() => {
    async function apiCalls() {
      const reader = new FileReader();

      reader.onload = (event) => {
        setNewSrc(event.target.result);
      };

      reader.readAsDataURL(inputValues.files[0]);
    }
    inputValues.files && apiCalls();
  }, [inputValues.files]);

  const [defaultInfo, setDeafultInfo] = useState([]);
  const [info, setInfo] = useState([]);

  const [renderedOnce, setRenderedOnce] = useState(false);
  useEffect(() => {
    async function apiCalls() {
      const result = {};
      result.types = await getTypes();
      result.brands = await getBrands();
      await setProduct((oldProduct) => ({
        ...oldProduct,
        types: result.types,
        brands: result.brands,
      }));

      await setInputValues((oldInputValues) => ({
        ...oldInputValues,
        brand: result.brands.length > 0 ? result.brands[0].name : "",
        type: result.types.length > 0 ? result.types[0].name : "",
      }));
    }

    apiCalls();

    setRenderedOnce(true);
  }, []);

  useEffect(() => {
    async function apiCalls() {
      const typeInfo = await getDefaultTypeInfo(
        product.types.find((type) => type.name === inputValues.type).id
      );
      await setDeafultInfo(
        typeInfo.map((elem) => ({ id: elem.id, key: elem.key, value: "" }))
      );
    }
    renderedOnce && apiCalls();
  }, [inputValues.type]);

  function changeDefaultStatHandler(value, id) {
    setDeafultInfo((prevInfo) =>
      prevInfo.map((i) => (i.id === id ? { ...i, value: value } : i))
    );
  }

  function addStatHandler(e) {
    e.preventDefault();
    setInfo((prevInfo) => [
      ...prevInfo,
      { key: "", value: "", number: nanoid() },
    ]);
  }

  function removeStatHandler(number) {
    setInfo((prevInfo) => prevInfo.filter((stat) => stat.number !== number));
  }

  function changeStatHandler(key, value, number) {
    setInfo((prevInfo) =>
      prevInfo.map((i) => (i.number === number ? { ...i, [key]: value } : i))
    );
  }

  function optionChangeHandler(e) {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [e.target.name]: e.target.value,
    }));
  }

  async function addProductHandler(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", inputValues.name);
    formData.append("price", inputValues.price);
    for (let i = 0; i < inputValues.files.length; i++) {
      formData.append("img", inputValues.files[i]);
    }
    formData.append(
      "brandId",
      product.brands.find((brand) => brand.name === inputValues.brand).id
    );
    formData.append(
      "typeId",
      product.types.find((type) => type.name === inputValues.type).id
    );
    formData.append("discount", 1 - inputValues.discount * 0.01);

    formData.append("description", inputValues.description);
    formData.append("left", inputValues.left);
    formData.append("isHyped", inputValues.isHyped);
    formData.append("info", JSON.stringify([...defaultInfo, ...info]));
    await createProduct(formData);
    await setInputValues({
      name: "",
      price: 0,
      files: null,
      brand: product.brands[0].name,
      type: product.types[0].name,
      description: "",
      left: 0,
      discount: 0,
      isHyped: false,
    });

    setInfo([]);
    await setNewSrc("");

    const dataArray = await getProducts({ limit, page: page });
    await setDisplayed({
      what: "products",
      data: dataArray.rows,
      totalCount: dataArray.count,
    });
  }

  return (
    renderedOnce && (
      <>
        <div className="modal-inner-container">
          <form>
            <h2>Добавить товар</h2>
            <select
              name="type"
              value={inputValues.type}
              onChange={optionChangeHandler}
            >
              {product.types.map((type) => {
                return (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                );
              })}
            </select>
            <select
              name="brand"
              value={inputValues.brand}
              onChange={optionChangeHandler}
            >
              {product.brands.map((brand) => {
                return (
                  <option key={brand.id} value={brand.name}>
                    {brand.name}
                  </option>
                );
              })}
            </select>
            {inputValues.files && inputValues.files.length > 1 && (
              <div>
                Ещё {inputValues.files.length - 1} изображени
                {inputValues.files.length - 1 === 1 ? "е" : "я"}...
              </div>
            )}
            <input
              onChange={(e) =>
                setInputValues((prevInputValues) => ({
                  ...prevInputValues,
                  name: e.target.value,
                }))
              }
              value={inputValues.name}
              type="text"
              placeholder="Введите название товара"
            />
            <input
              onChange={(e) =>
                setInputValues((prevInputValues) => ({
                  ...prevInputValues,
                  isHyped: !prevInputValues.isHyped,
                }))
              }
              value={inputValues.isHyped}
              type="checkbox"
              id="isHyped"
            />
            <label htmlFor="isHyped">Хит?</label>
            <h3>Стоимость</h3>
            <input
              onChange={(e) =>
                setInputValues((prevInputValues) => ({
                  ...prevInputValues,
                  price:
                    Number(e.target.value) === 0 ? 1 : Number(e.target.value),
                }))
              }
              value={inputValues.price}
              type="number"
              placeholder="Введите стоимость товара"
              min={1}
              max={999999}
            />
            <div>
              <h3>Размер скидки</h3>

              <div className="input-icon">
                <input
                  onChange={(e) =>
                    setInputValues((prevInputValues) => ({
                      ...prevInputValues,
                      discount:
                        Number(e.target.value) === null
                          ? 0
                          : Number(e.target.value) > 100
                          ? 100
                          : Number(e.target.value),
                    }))
                  }
                  value={inputValues.discount}
                  type="number"
                  placeholder="Введите размер скидки (если есть)"
                  min={0}
                  max={100}
                />
                <i>%</i>
              </div>
            </div>
            <h3>Количество товара</h3>

            <input
              onChange={(e) =>
                setInputValues((prevInputValues) => ({
                  ...prevInputValues,
                  left: Number(e.target.value),
                }))
              }
              value={inputValues.left}
              type="number"
              placeholder="Введите количество товара"
              min={0}
            />
            <img src={newSrc ? newSrc : "/assets/default-img.png"} />
            <input
              onChange={(e) => {
                setInputValues((prevInputValues) => ({
                  ...prevInputValues,
                  files: e.target.files,
                }));
              }}
              type="file"
              multiple
            />
            <textarea
              className="modal-product-description"
              maxLength="1000"
              placeholder="Напишите описание товара"
              value={inputValues.description}
              onChange={(e) =>
                setInputValues((oldInputValues) => ({
                  ...oldInputValues,
                  description: e.target.value,
                }))
              }
            ></textarea>
            {defaultInfo.map((elem) => {
              return (
                <div className="modal-stats" key={elem.id}>
                  <input
                    className="modal-stat-name"
                    type="text"
                    placeholder="Введите название свойства"
                    value={elem.key}
                    disabled
                  />
                  <input
                    className="modal-stat-value"
                    type="text"
                    placeholder="Введите значение свойства"
                    value={elem.value}
                    onChange={(e) =>
                      changeDefaultStatHandler(e.target.value, elem.id)
                    }
                  />
                </div>
              );
            })}
            {info.map((elem) => {
              return (
                <div className="modal-stats" key={elem.number}>
                  <input
                    className="modal-stat-name"
                    type="text"
                    placeholder="Введите название свойства"
                    value={elem.key}
                    onChange={(e) =>
                      changeStatHandler("key", e.target.value, elem.number)
                    }
                  />
                  <input
                    className="modal-stat-value"
                    type="text"
                    placeholder="Введите значение свойства"
                    value={elem.value}
                    onChange={(e) =>
                      changeStatHandler("value", e.target.value, elem.number)
                    }
                  />
                  <button
                    className="product-option-container"
                    onClick={() => removeStatHandler(elem.number)}
                  >
                    Удалить
                  </button>
                </div>
              );
            })}
            <button
              className="product-option-container"
              onClick={addStatHandler}
            >
              Добавить новое свойство
            </button>

            <div className="product-options-container">
              <button
                className="product-option-container"
                onClick={() => setWhatIsShown("")}
              >
                Закрыть
              </button>
              <button
                className="product-option-container"
                onClick={addProductHandler}
              >
                Добавить
              </button>
            </div>
          </form>
        </div>
      </>
    )
  );
}

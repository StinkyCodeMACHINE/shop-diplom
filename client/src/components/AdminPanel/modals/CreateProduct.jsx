import react, { useState, useEffect, useContext } from "react";
import { createProduct, getTypes, getBrands, getDefaultTypeInfo } from "../../../API/productAPI";
import { Context } from "../../../App";
import { nanoid } from "nanoid";

export default function CreateProduct({ isShown, hide }) {
  const { product, setProduct, whatIsShown } = useContext(Context);

  const [inputValues, setInputValues] = useState({
    name: "",
    price: 0,
    files: null,
    brand: "",
    type: "",
  });

  const [defaultInfo, setDeafultInfo] = useState([])
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
        brand: product.brands.length > 0 ? product.brands[0].name : "",
        type: product.types.length > 0 ? product.types[0].name : "",
      }));
    }

    apiCalls();

    setRenderedOnce(true);
  }, []);

  useEffect(() => {
    async function apiCalls() {
      const typeInfo = await getDefaultTypeInfo(
        product.types.find((type) => type.name === inputValues.type).id
      )
      await setDeafultInfo(typeInfo.map(elem => ({...elem, value: ""})));

    }
    renderedOnce && apiCalls();

  }, [inputValues.type]);

  function changeDefaultStatHandler(key, value, id) {
    setDeafultInfo((prevInfo) =>
      prevInfo.map((i) => (i.id === id ? { ...i, [key]: value } : i))
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
    console.log(`brands from createproduct: ${JSON.stringify(product.brands)}`)
    console.log(`brandex from createproduct: ${inputValues.brand}`);
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
    console.log(`info from createProduct: ${JSON.stringify([...defaultInfo, info])}`);
    formData.append("info", JSON.stringify([...defaultInfo, ...info]));
    await createProduct(formData);
    await setInputValues({
      name: "",
      price: 0,
      files: null,
      brand: product.brands[0].name,
      type: product.types[0].name,
    });

    setInfo([]);
  }

  return (
    renderedOnce && (
      <>
        {whatIsShown === "product" && (
          <div
            className="admin-page-modal-opacity"
            onClick={(e) =>
              e.target.classList.contains("admin-page-modal-opacity") && hide()
            }
          >
            <div className="modal-inner-container">
              <form>
                <h2>Добавить устройство</h2>
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
                <input
                  onChange={(e) =>
                    setInputValues((prevInputValues) => ({
                      ...prevInputValues,
                      name: e.target.value,
                    }))
                  }
                  value={inputValues.name}
                  type="text"
                  placeholder="Введите название устройства"
                />
                <input
                  onChange={(e) =>
                    setInputValues((prevInputValues) => ({
                      ...prevInputValues,
                      price: Number(e.target.value),
                    }))
                  }
                  value={inputValues.price}
                  type="number"
                  placeholder="Введите стоимость устройства"
                />
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
                          changeDefaultStatHandler(
                            "value",
                            e.target.value,
                            elem.id
                          )
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
                          changeStatHandler(
                            "value",
                            e.target.value,
                            elem.number
                          )
                        }
                      />
                      <button onClick={() => removeStatHandler(elem.number)}>
                        Удалить
                      </button>
                    </div>
                  );
                })}
                <button onClick={addStatHandler}>
                  Добавить новое свойство
                </button>

                <div>
                  <button onClick={() => hide()}>Закрыть</button>
                  <button onClick={addProductHandler}>Добавить</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    )
  );
}

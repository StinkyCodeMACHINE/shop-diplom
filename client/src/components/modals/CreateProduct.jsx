import react, { useContext, useState } from "react";
import { Context } from "../../App";
import { createProduct } from "../../API/productAPI";

export default function CreateProduct({ isShown, hide }) {
  const { product } = useContext(Context);

  const [inputValues, setInputValues] = useState({
    name: "",
    price: 0,
    file: null,
    brand: product.brands[0].name,
    type: product.types[0].name,
  });
  const [info, setInfo] = useState([]);

  function addStatHandler(e) {
    e.preventDefault();
    setInfo((prevInfo) => [
      ...prevInfo,
      { title: "", description: "", number: Date.now() },
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

  function selectFile(e) {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      file: e.target.files[0],
    }));
  }

  async function addProductHandler(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", inputValues.name);
    formData.append("price", inputValues.price);
    formData.append("img", inputValues.file);
    formData.append(
      "brandId",
      product.brands.find((brand) => brand.name === inputValues.brand).id
    );
    formData.append(
      "typeId",
      product.types.find((type) => type.name === inputValues.type).id
    );
    formData.append("info", JSON.stringify(info));
    await createProduct(formData);
    setInputValues({
      name: "",
      price: 0,
      file: null,
      brand: product.brands[0].name,
      type: product.types[0].name,
    });
    
    setInfo([])
  }

  return (
    <>
      {isShown.product && (
        <div className="modal-container">
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
              <input onChange={selectFile} type="file" />
              {info.map((elem) => {
                return (
                  <div className="modal-stats" key={elem.number}>
                    <input
                      className="modal-stat-name"
                      type="text"
                      placeholder="Введите название свойства"
                      value={elem.title}
                      onChange={(e) =>
                        changeStatHandler("title", e.target.value, elem.number)
                      }
                    />
                    <input
                      className="modal-stat-value"
                      type="text"
                      placeholder="Введите значение свойства"
                      value={elem.description}
                      onChange={(e) =>
                        changeStatHandler(
                          "description",
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
              <button onClick={addStatHandler}>Добавить новое свойство</button>;
              <div>
                <button onClick={() => hide("product")}>Закрыть</button>
                <button onClick={addProductHandler}>Добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

import react, { useState, useEffect, useContext } from "react";
import {
  changeType,
  createType,
  getDefaultTypeInfo,
  getGroups,
  getTypes,
  getTypesWithLimit,
} from "../../../API/productAPI";
import { Context } from "../../../App";
import { nanoid } from "nanoid";
import { API_URL, TYPE_IMAGE_URL } from "../../../utils/consts";

export default function ChangeType({ setDisplayed, page, limit, prevThing }) {
  const [inputValues, setInputValues] = useState({
    name: Object.keys(prevThing).length > 0 ? prevThing.name : "",
    file: null,
    group: "",
  });
  const [info, setInfo] = useState([]);
  const [newSrc, setNewSrc] = useState("");

  const [renderedOnce, setRenderedOnce] = useState(false);

  const { whatIsShown, product, setProduct, setWhatIsShown } =
    useContext(Context);

  useEffect(() => {
    async function apiCalls() {
      const reader = new FileReader();

      reader.onload = (event) => {
        setNewSrc(event.target.result);
      };

      reader.readAsDataURL(inputValues.file);
    }
    inputValues.file && apiCalls();
  }, [inputValues.file]);

  useEffect(() => {
    async function apiCalls() {
      const groups = await getGroups();
      const foundGroup = groups.find(
        (groupElem) => groupElem.id === prevThing.groupId
      );
      await setInputValues((prevInputValues) => ({
        ...prevInputValues,
        group: foundGroup.name,
      }));
      let typeInfo = await getDefaultTypeInfo(prevThing.id);
      typeInfo = typeInfo.map((elem) => ({ ...elem, number: nanoid() }));
      await setInfo(typeInfo);
      await setProduct((oldProduct) => ({
        ...oldProduct,
        groups,
      }));
    }

    apiCalls();

    setRenderedOnce(true);
  }, []);

  async function addHandler(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", inputValues.name);
    newSrc && formData.append("img", inputValues.file);
    formData.append(
      "groupId",
      product.groups.find((group) => group.name === inputValues.group).id
    );
    formData.append("info", JSON.stringify(info));
    const type = await changeType({ type: formData, id: prevThing.id });

    await setInputValues({ name: "", file: null, group: "" });
    await setInfo([]);
    await setNewSrc("");
    const dataArray = await getTypesWithLimit({ limit, page: page });
    await setDisplayed({
      what: "types",
      data: dataArray.rows,
      totalCount: dataArray.count,
    });
    setWhatIsShown("");
  }

  function addStatHandler(e) {
    e.preventDefault();
    setInfo((prevInfo) => [...prevInfo, { key: "", number: nanoid() }]);
  }

  function removeStatHandler(number) {
    setInfo((prevInfo) => prevInfo.filter((stat) => stat.number !== number));
  }

  return (
    renderedOnce && (
      <>
        <div className="modal-inner-container">
          <form>
            <input
              value={inputValues.name}
              onChange={(e) => {
                setInputValues((oldInputValues) => ({
                  ...oldInputValues,
                  name: e.target.value,
                }));
              }}
              type="text"
              placeholder="Введите название категории"
            />
            <select
              name="group"
              value={inputValues.group}
              onChange={(e) => {
                setInputValues((oldInputValues) => ({
                  ...oldInputValues,
                  group: e.target.value,
                }));
              }}
            >
              {product.groups.map((group) => {
                return (
                  <option key={group.id} value={group.name}>
                    {group.name}
                  </option>
                );
              })}
            </select>
            <img
              src={
                newSrc
                  ? newSrc
                  : prevThing.img
                  ? API_URL + TYPE_IMAGE_URL + prevThing.img
                  : "/assets/default-img.png"
              }
            />
            <input
              onChange={(e) => {
                setInputValues((prevInputValues) => ({
                  ...prevInputValues,
                  file: e.target.files[0],
                }));
              }}
              type="file"
            />
            {info.map((elem) => {
              return (
                <div className="modal-stats" key={elem.number}>
                  <input
                    className="modal-stat-name"
                    type="text"
                    placeholder="Введите название свойства"
                    value={elem.key}
                    onChange={(e) => {
                      setInfo((prevInfo) =>
                        prevInfo.map((i) =>
                          i.number === elem.number
                            ? { ...i, key: e.target.value }
                            : i
                        )
                      );
                    }}
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
              <button className="product-option-container" onClick={addHandler}>
                Изменить
              </button>
            </div>
          </form>
        </div>
      </>
    )
  );
}

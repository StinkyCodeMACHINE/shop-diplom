import react, { useState, useEffect, useContext } from "react";
import { createType, getGroups, getTypes } from "../../../API/productAPI";
import { Context } from "../../../App";
import { nanoid } from "nanoid"

export default function CreateType({ isShown, hide }) {
  const [inputValues, setInputValues] = useState({
    name: "",
    file: null,
    group: "",
  });
  const [info, setInfo] = useState([]);

  const [renderedOnce, setRenderedOnce] = useState(false);

  const { whatIsShown, product, setProduct } = useContext(Context);

  useEffect(() => {
    async function apiCalls() {
      const groups = await getGroups();
      await setProduct((oldProduct) => ({
        ...oldProduct,
        groups,
      }));

      await setInputValues((oldInputValues) => ({
        ...oldInputValues,
        group: product.groups.length > 0 ? product.groups[0].name : "",
      }));
    }

    apiCalls();

    setRenderedOnce(true);
  }, []);

  async function addHandler(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", inputValues.name);
    formData.append("img", inputValues.file);
    formData.append(
      "groupId",
      product.groups.find((group) => group.name === inputValues.group).id
    );
    formData.append("info", JSON.stringify(info));
    const type = await createType(formData);
    await setProduct((oldProduct) => ({
      ...oldProduct,
      types: [...oldProduct.types, type],
    }));
    await setInputValues({ name: "", file: null, group: "" });
    await setInfo([]);
  }

  function addStatHandler(e) {
    e.preventDefault();
    setInfo((prevInfo) => [
      ...prevInfo,
      { key: "", number: nanoid() },
    ]);
  }

  function removeStatHandler(number) {
    setInfo((prevInfo) => prevInfo.filter((stat) => stat.number !== number));
  }

  return (
    renderedOnce && (
      <>
        {whatIsShown === "type" && (
          <div
            className="admin-page-modal-opacity"
            onClick={(e) =>
              e.target.classList.contains("admin-page-modal-opacity") && hide()
            }
          >
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
                  placeholder="Введите название типа"
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
                        onChange={(e) =>
                          {
                            setInfo((prevInfo) =>
                              prevInfo.map((i) =>
                                i.number === elem.number
                                  ? { ...i, key: e.target.value }
                                  : i
                              )
                            );
                          }
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
                  <button onClick={addHandler}>Добавить</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    )
  );
}

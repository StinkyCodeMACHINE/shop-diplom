import react, { useState, useEffect, useContext } from "react";
import { createType, getGroups } from "../../../API/productAPI";
import { Context } from "../../../App";

export default function CreateType({ isShown, hide }) {
  const [inputValues, setInputValues] = useState({
    name: "",
    file: null,
    group: "",
  });

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
    await createType(formData);
    await setInputValues({ name: "", file: null });
  }

  function changeHandler(e) {
    setInputValues(e.target.value);
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
                  onChange={(e) => {setInputValues(oldInputValues => ({...oldInputValues, name: e.target.value}))}}
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

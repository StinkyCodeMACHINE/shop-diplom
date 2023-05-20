import react, { useState, useContext } from "react";
import { createGroup } from "../../../API/productAPI";
import { Context } from "../../../App";

export default function CreateGroup({ isShown, hide }) {
  const [inputValues, setInputValues] = useState({
    name: "",
    file: null,
  });
  
  const { whatIsShown } = useContext(Context);

  async function addHandler(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", inputValues.name);
    formData.append("img", inputValues.file);

    await createGroup(formData);
    await setInputValues({ name: "", file: null });
  }

  return (
    <>
      {whatIsShown === "group" && (
        <div
          className="admin-page-modal-opacity"
          onClick={(e) =>
            e.target.classList.contains("admin-page-modal-opacity") && hide()
          }
        >
          <div className="modal-inner-container">
            <form>
              <input
                onChange={(e) => {setInputValues((oldInputValues) => ({
                  ...oldInputValues,
                  name: e.target.value,
                }))}}
                value={inputValues.name}
                type="text"
                placeholder="Введите название группы"
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
              <div>
                <button onClick={() => hide()}>Закрыть</button>
                <button onClick={addHandler}>Добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

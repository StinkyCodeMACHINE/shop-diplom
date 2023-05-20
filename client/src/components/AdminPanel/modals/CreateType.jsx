import react, { useState, useContext } from "react";
import { createType } from "../../../API/productAPI";
import { Context } from "../../../App";


export default function CreateType({ isShown, hide }) {
  const [inputValues, setInputValues] = useState({
    name: "",
    file: null,
  });
  const { whatIsShown } = useContext(Context);

  async function addHandler(e) {
    e.preventDefault()
    const formData = new FormData();
    formData.append("name", inputValues.name);
    formData.append("img", inputValues.file);
    await createType(formData);
    await setInputValues({ name: "", file: null });
  }

  function changeHandler(e) {
    setInputValues(e.target.value);
  }
  
  return (
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
                onChange={changeHandler}
                type="text"
                placeholder="Введите название типа"
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

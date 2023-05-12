import react, { useState } from "react";
import { createBrand } from "../../../API/productAPI";

export default function CreateBrand({ isShown, hide }) {
  const [inputValues, setInputValues] = useState("");
  function addHandler() {
    createBrand({ name: inputValues }).then((data) => setInputValues(""));
    setInputValues("");
  }

  function changeHandler(e) {
    setInputValues(e.target.value);
  }

  return (
    <>
      {isShown.brand && (
        <div
          className="admin-page-modal-container"
          onClick={() => hide("brand")}
        >
          <div className="modal-inner-container">
            <form>
              <input
                onChange={changeHandler}
                value={inputValues}
                type="text"
                placeholder="Введите название бренда"
              />
              <div>
                <button onClick={() => hide("brand")}>Закрыть</button>
                <button onClick={addHandler}>Добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

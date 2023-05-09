import react, { useState } from "react";
import { createType } from "../../API/productAPI";

export default function CreateType({ isShown, hide }) {
  const [inputValues, setInputValues] = useState("");
  function addHandler() {
    createType({ name: inputValues }).then((data) => setInputValues(""));
    setInputValues("")
  }

  function changeHandler(e) {
    setInputValues(e.target.value);
  }
  return (
    <>
      {isShown.type && (
        <div className="modal-container">
          <div className="modal-inner-container">
            <form>
              <input
                value={inputValues}
                onChange={changeHandler}
                type="text"
                placeholder="Введите название типа"
              />
              <div>
                <button onClick={() => hide("type")}>Закрыть</button>
                <button onClick={addHandler}>Добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

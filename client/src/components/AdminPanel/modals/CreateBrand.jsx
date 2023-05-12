import react, { useState, useContext } from "react";
import { createBrand } from "../../../API/productAPI";
import { Context } from "../../../App";

export default function CreateBrand({ isShown, hide }) {
  const [inputValues, setInputValues] = useState("");
  const { whatIsShown} = useContext(Context);

  async function addHandler(e) {
    e.preventDefault();
    await createBrand({ name: inputValues }).then((data) => setInputValues(""));
    setInputValues("");
  }

  function changeHandler(e) {
    setInputValues(e.target.value);
  }

  return (
    <>
      {whatIsShown==="brand" && (
        <div
          className="admin-page-modal-opacity"
          onClick={(e) =>
            e.target.classList.contains("admin-page-modal-opacity") && hide()
          }
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

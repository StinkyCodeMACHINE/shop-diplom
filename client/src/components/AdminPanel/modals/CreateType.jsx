import react, { useState, useContext } from "react";
import { createType } from "../../../API/productAPI";
import { Context } from "../../../App";


export default function CreateType({ isShown, hide }) {
  const [inputValues, setInputValues] = useState("");
  const { whatIsShown } = useContext(Context);

  async function addHandler(e) {
    e.preventDefault()
    await createType({ name: inputValues })
    await setInputValues("")
  }

  function changeHandler(e) {
    setInputValues(e.target.value);
  }
  
  return (
    <>
      {whatIsShown==="type" && (
        <div
          className="admin-page-modal-opacity"
          onClick={(e) =>
            e.target.classList.contains("admin-page-modal-opacity") && hide()
          }
        >
          <div className="modal-inner-container">
            <form>
              <input
                value={inputValues}
                onChange={changeHandler}
                type="text"
                placeholder="Введите название типа"
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

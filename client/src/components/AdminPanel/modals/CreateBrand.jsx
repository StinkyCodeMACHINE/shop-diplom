import react, { useState, useContext } from "react";
import { createBrand } from "../../../API/productAPI";
import { Context } from "../../../App";

export default function CreateBrand({ isShown, hide }) {
  const [inputValues, setInputValues] = useState({
    name:"",
    file: null
  });
  const { whatIsShown} = useContext(Context);

  async function addHandler(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", inputValues.name);
    formData.append("img", inputValues.file);

    // await createBrand({ name: inputValues })
    await createBrand(formData)
    await setInputValues({name: "", file: null});
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
                value={inputValues.name}
                type="text"
                placeholder="Введите название бренда"
              />
              <input onChange={(e) => {
                  setInputValues((prevInputValues) => ({
                    ...prevInputValues,
                    file: e.target.files[0],
                  }));
                }} type="file"/>
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

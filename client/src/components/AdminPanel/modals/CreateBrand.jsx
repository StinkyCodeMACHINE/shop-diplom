import react, { useState, useContext, useEffect } from "react";
import { createBrand } from "../../../API/productAPI";
import { Context } from "../../../App";

export default function CreateBrand() {
  const [inputValues, setInputValues] = useState({
    name: "",
    file: null,
  });
  const [newSrc, setNewSrc] = useState("");
  const { whatIsShown, setWhatIsShown } = useContext(Context);

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

  async function addHandler(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", inputValues.name);
    formData.append("img", inputValues.file);

    // await createBrand({ name: inputValues })
    await createBrand(formData);
    await setInputValues({ name: "", file: null });
    await setNewSrc("");
  }

  return (
    <>
      
      
        <div className="modal-inner-container">
          <form>
            <input
              onChange={(e) => {
                setInputValues((oldInputValues) => ({
                  ...oldInputValues,
                  name: e.target.value,
                }));
              }}
              value={inputValues.name}
              type="text"
              placeholder="Введите название бренда"
            />
            <img src={newSrc ? newSrc : "/assets/default-img.png"} />
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
              <button onClick={() => setWhatIsShown("")}>Закрыть</button>
              <button onClick={addHandler}>Добавить</button>
            </div>
          </form>
        </div>
      
      
    </>
  );
}

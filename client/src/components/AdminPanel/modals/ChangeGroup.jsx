import react, { useState, useContext, useEffect } from "react";
import {
  changeGroup,
  createGroup,
  getGroups,
  getGroupsWithLimit,
} from "../../../API/productAPI";
import { Context } from "../../../App";
import { API_URL, GROUP_IMAGE_URL } from "../../../utils/consts";

export default function ChangeGroup({ setDisplayed, page, limit, prevThing }) {
  const [inputValues, setInputValues] = useState({
    name: Object.keys(prevThing).length > 0 ? prevThing.name : "",
    file: null,
  });
  const [newSrc, setNewSrc] = useState("");

  const { whatIsShown, setProduct, setWhatIsShown } = useContext(Context);

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
    newSrc && formData.append("img", inputValues.file);

    const group = await changeGroup({ group: formData, id: prevThing.id });
    await setInputValues({ name: "", file: null });
    await setNewSrc("");
    const dataArray = await getGroupsWithLimit({ limit, page: page });
    await setDisplayed({
      what: "groups",
      data: dataArray.rows,
      totalCount: dataArray.count,
    });
    setWhatIsShown("");
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
            placeholder="Введите название группы"
          />
          <img
            src={
              newSrc
                ? newSrc
                : prevThing.img
                ? API_URL + GROUP_IMAGE_URL + prevThing.img
                : "/assets/default-img.png"
            }
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
          <div className="product-options-container">
            <button
              className="product-option-container"
              onClick={() => setWhatIsShown("")}
            >
              Закрыть
            </button>
            <button className="product-option-container" onClick={addHandler}>
              Изменить
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

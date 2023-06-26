import react, { useState, useEffect, useContext } from "react";
import { getProducts, loadFromExcel } from "../../../API/productAPI";
import { Context } from "../../../App";
import { nanoid } from "nanoid";

export default function LoadProductsExcel({ setDisplayed, page, limit }) {
  const { product, setProduct, whatIsShown, setWhatIsShown } =
    useContext(Context);

  const [inputValues, setInputValues] = useState({
    file: null,
  });

  const [resultValues, setResultValues] = useState({createdAmount: 0, updatedAmount: 0})
  const [addedPopUp, setAddedPopUp] = useState(false);

  useEffect(() => {
    async function apiCalls() {
      const timer = setTimeout(() => setAddedPopUp(false), 3000);

      return () => {
        clearTimeout(timer);
      };
    }

    addedPopUp && apiCalls();
  }, [addedPopUp]);

  async function addProductHandler(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("excel", inputValues.file);
    const { createdAmount, updatedAmount } = await loadFromExcel(formData);
    await setResultValues({ createdAmount, updatedAmount });
    await setInputValues({
      file: null,
    });
    await setAddedPopUp(true)
    
    const dataArray = await getProducts({ limit, page: page });
    await setDisplayed({
      what: "products",
      data: dataArray.rows,
      totalCount: dataArray.count,
    });
  }

  return (
    <>
      <div className="modal-inner-container">
        <form>
          <h2>Загрузить товары из Excel</h2>

          <h3>Выберите Excel файл формата xlsx</h3>
          <input
            onChange={(e) => {
              setInputValues((prevInputValues) => ({
                ...prevInputValues,
                file: e.target.files[0],
              }));
            }}
            type="file"
            accept=".xls,.xlsx"
          />

          <div className="product-options-container">
            <button
              className="product-option-container"
              onClick={() => setWhatIsShown("")}
            >
              Закрыть
            </button>
            <button
              className="product-option-container"
              onClick={addProductHandler}
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
      <div
        style={
          addedPopUp
            ? {
                opacity: "1",
                zIndex: "1000",
                backgroundColor: "var(--green-a)",
              }
            : { opacity: "0", backgroundColor: "var(--green-a)" }
        }
        id="error-pop-up"
      >
        <div>Добавлено: {resultValues.createdAmount}</div>
        <div>Обновлено: {resultValues.updatedAmount}</div>
      </div>
    </>
  );
}

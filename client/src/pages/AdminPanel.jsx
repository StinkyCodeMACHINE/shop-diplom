import react, { useState, useContext } from "react";
import CreateGroup from "../components/AdminPanel/modals/CreateGroup";
import CreateType from "../components/AdminPanel/modals/CreateType";
import CreateBrand from "../components/AdminPanel/modals/CreateBrand";
import CreateProduct from "../components/AdminPanel/modals/CreateProduct";
import { Context } from "../App";

export default function AdminPanel() {
  const { product, setWhatIsShown, whatIsShown } = useContext(Context);

  function hide() {
    setWhatIsShown("");
  }
  return (
    <>
      {whatIsShown !== "" && (
        <div
          className="admin-page-modal-opacity"
          onClick={(e) =>
            e.target.classList.contains("admin-page-modal-opacity") &&
            setWhatIsShown("")
          }
        >
          {whatIsShown === "brand" && <CreateBrand />}
          {whatIsShown === "group" && <CreateGroup />}
          {whatIsShown === "type" && <CreateType />}
          {whatIsShown === "product" && <CreateProduct />}
        </div>
      )}

      <div className="admin-page-container">
        <button onClick={() => setWhatIsShown("group")}>
          Добавить новую группу
        </button>
        <button onClick={() => setWhatIsShown("type")}>
          Добавить новый тип
        </button>
        <button onClick={() => setWhatIsShown("brand")}>
          Добавить новый бренд
        </button>
        <button onClick={() => setWhatIsShown("product")}>
          Добавить новый товар
        </button>
      </div>
    </>
  );
}

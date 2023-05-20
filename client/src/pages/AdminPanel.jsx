import react, { useState, useContext } from "react";
import CreateType from "../components/AdminPanel/modals/CreateType";
import CreateBrand from "../components/AdminPanel/modals/CreateBrand";
import CreateProduct from "../components/AdminPanel/modals/CreateProduct";
import { Context } from "../App";

export default function AdminPanel() {
  const { product, setWhatIsShown } = useContext(Context);

  function show(what) {
    setWhatIsShown(what);
  }

  function hide() {
    setWhatIsShown("");
  }
  return (
    <>
      <CreateType hide={hide} />
      <CreateBrand hide={hide} />
      <CreateProduct hide={hide} />
      <div className="admin-page-container">
        <button onClick={() => show("type")}>Добавить новый тип</button>
        <button onClick={() => show("brand")}>Добавить новый бренд</button>
        <button onClick={() => show("product")}>Добавить новый товар</button>
      </div>
    </>
  );
}

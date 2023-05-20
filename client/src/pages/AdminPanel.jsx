import react, { useState, useContext } from "react";
import CreateGroup from "../components/AdminPanel/modals/CreateGroup";
import CreateType from "../components/AdminPanel/modals/CreateType";
import CreateBrand from "../components/AdminPanel/modals/CreateBrand";
import CreateProduct from "../components/AdminPanel/modals/CreateProduct";
import { Context } from "../App";

export default function AdminPanel() {
  const { product, setWhatIsShown } = useContext(Context);

  function hide() {
    setWhatIsShown("");
  }
  return (
    <>
      <CreateGroup hide={hide} />
      <CreateType hide={hide} />
      <CreateBrand hide={hide} />
      <CreateProduct hide={hide} />
      <div className="admin-page-container">
        <button onClick={() => setWhatIsShown("group")}>Добавить новую группу</button>
        <button onClick={() => setWhatIsShown("type")}>Добавить новый тип</button>
        <button onClick={() => setWhatIsShown("brand")}>Добавить новый бренд</button>
        <button onClick={() => setWhatIsShown("product")}>Добавить новый товар</button>
      </div>
    </>
  );
}

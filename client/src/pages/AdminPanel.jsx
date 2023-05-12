import react, {useState} from "react";
import CreateType from '../components/AdminPanel/modals/CreateType'
import CreateBrand from "../components/AdminPanel/modals/CreateBrand";
import CreateProduct from "../components/AdminPanel/modals/CreateProduct";

export default function AdminPanel() {
  const [isShown, setIsShown] = useState({type: false, brand:false, product:false})
  function show(what) {
    setIsShown({...isShown, [what]: true})
  }
  function hide(what) {
    setIsShown({ ...isShown, [what]: false });
  }
  return (
    <>
      <CreateType isShown={isShown} hide={hide} />
      <CreateBrand isShown={isShown} hide={hide} />
      <CreateProduct isShown={isShown} hide={hide} />
      <div className="admin-page-container">
        <button onClick={() => show("type")}>Добавить новый тип</button>
        <button onClick={() => show("brand")}>Добавить новый Brand</button>
        <button onClick={() => show("product")}>Добавить новый девайс</button>
      </div>
    </>
  );
}

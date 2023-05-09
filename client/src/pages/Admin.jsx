import react, {useState} from "react";
import CreateType from '../components/modals/CreateType'
import CreateBrand from "../components/modals/CreateBrand";
import CreateProduct from "../components/modals/CreateProduct";

export default function Admin() {
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

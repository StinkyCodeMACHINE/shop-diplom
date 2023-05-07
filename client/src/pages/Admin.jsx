import react, {useState} from "react";
import CreateType from '../components/modals/CreateType'
import CreateBrand from "../components/modals/CreateBrand";
import CreateDevice from "../components/modals/CreateDevice";

export default function Admin() {
  const [isShown, setIsShown] = useState({type: false, brand:false, device:false})
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
      <CreateDevice isShown={isShown} hide={hide} />
      <div className="admin-page-container">
        <button onClick={() => show('type')}>Добавить новый тип</button>
        <button onClick={() => show('brand')}>Добавить новый Brand</button>
        <button onClick={() => show('device')}>Добавить новый девайс</button>
      </div>
    </>
  );
}

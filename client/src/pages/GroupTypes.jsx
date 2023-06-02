import react, { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  API_URL,
  PRODUCT_ROUTE,
  PRODUCT_IMAGE_URL,
  productLimitValues,
  TYPE_IMAGE_URL,
  SHOP_ROUTE,
} from "../utils/consts";
import {
  getBrands,
  getFavouriteIds,
  getTypes,
  getFavouriteProducts,
  getGroups,
} from "../API/productAPI";
import Pagination from "../components/Favourite/Pagination";
import ProductCard from "../components/Favourite/ProductCard";

export default function GroupTypes() {
  const { product, setProduct, user, whatIsShown, setWhatIsShown } =
    useContext(Context);
  let { id } = useParams();
  id = Number(id)
  const navigate = useNavigate();

  const [name, setName] = useState("")

  const [renderedOnce, setRenderedOnce] = useState(false);
  const [groupTypes, setGroupTypes] = useState([]);

  //получение типов
  useEffect(() => {
    async function apiCalls() {
      await getTypes();
      let types = await getTypes();
      let groups = await getGroups();
      const foundGroup = groups.find(elem => elem.id === id).name
      await setName(foundGroup);
      types = types.filter((typeElem) => typeElem.groupId === id);
      await setGroupTypes(types);
      await setRenderedOnce(true);
    }

    apiCalls();
  }, []);

  return (
    <div className="group-types-container">
      {renderedOnce && groupTypes.length > 0 && (
        <>
          <h2>{name}</h2>
          <div className="product-page-group-and-type">
            <Link
              to={SHOP_ROUTE}
              onClick={() =>
                setProduct((oldProduct) => ({
                  ...oldProduct,
                  selectedType: {},
                  selectedGroup: {},
                  name: "",
                }))
              }
              className="product-page-catalogue"
            >
              Каталог
            </Link>
            <div>{">"}</div>
            <Link className="product-page-group">{name}</Link>
            <div>{">"}</div>
          </div>
          <div className="group-types-cards-container">
            {groupTypes.map((groupTypesElem) => {
              return (
                <div
                  onClick={async () => {
                    await setProduct((oldProduct) => ({
                      ...oldProduct,
                      selectedType: groupTypesElem,
                    }));
                    navigate(SHOP_ROUTE);
                  }}
                  className="group-types-card"
                >
                  <img
                    src={
                      groupTypesElem.img
                        ? API_URL + TYPE_IMAGE_URL + groupTypesElem.img
                        : "/assets/default-img.png"
                    }
                  />
                  <div>{groupTypesElem.name}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

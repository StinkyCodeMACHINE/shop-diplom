import react, { useState, useEffect, useContext } from "react";
import {
  createProduct,
  getTypes,
  getBrands,
  getDefaultTypeInfo,
  createBanner,
  getBanners,
} from "../../../API/productAPI";
import { Context } from "../../../App";
import { nanoid } from "nanoid";

export default function CreateBanner({ setDisplayed, page, limit }) {
  const { product, setProduct, whatIsShown, setWhatIsShown } =
    useContext(Context);
  const [newSrc, setNewSrc] = useState("");

  const [inputValues, setInputValues] = useState({
    file: null,
    brand: "",
    type: "",
  });

  const [enabled, setEnabled] = useState({brand: false, type: true})
  const [renderedOnce, setRenderedOnce] = useState(false);

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


  useEffect(() => {
    async function apiCalls() {
      const result = {};
      result.types = await getTypes();
      result.brands = await getBrands();
      await setProduct((oldProduct) => ({
        ...oldProduct,
        types: result.types,
        brands: result.brands,
      }));

      await setInputValues((oldInputValues) => ({
        ...oldInputValues,
        brand: result.brands.length > 0 ? result.brands[0].name : "",
        type: result.types.length > 0 ? result.types[0].name : "",
      }));
    }

    apiCalls();

    setRenderedOnce(true);
  }, []);

  async function addHandler(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("img", inputValues.file);
    formData.append(
      "brandId",
      enabled.brand ? product.brands.find((brand) => brand.name === inputValues.brand).id : null
    );
    formData.append(
      "typeId",
      enabled.type ? product.types.find((type) => type.name === inputValues.type).id : null
    );

    await createBanner(formData);
    await setInputValues({
      files: null,
      brand: product.brands[0].name,
      type: product.types[0].name,
    });

    await setNewSrc("");

    const dataArray = await getBanners({ limit, page });
    await setDisplayed({
      what: "banners",
      data: dataArray,
      totalCount: dataArray.length,
    });
  }

  return (
    renderedOnce && (
      <>
        <div className="modal-inner-container">
          <form>
            <h2>Добавить баннер</h2>
            <div>
              <input
                type="checkbox"
                checked={enabled.type}
                onChange={() =>
                  setEnabled((oldEnabled) => ({
                    ...oldEnabled,
                    type: !oldEnabled.type,
                  }))
                }
                id="type-checkbox"
              />
              <label htmlFor="type-checkbox">Категория?</label>
              <select
                name="type"
                value={inputValues.type}
                onChange={(e) =>
                  setInputValues((oldInputValues) => ({
                    ...oldInputValues,
                    type: e.target.value,
                  }))
                }
                style={!enabled.type ? { display: "none" } : {}}
              >
                {product.types.map((type) => {
                  return (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <input
                type="checkbox"
                checked={enabled.brand}
                onChange={() =>
                  setEnabled((oldEnabled) => ({
                    ...oldEnabled,
                    brand: !oldEnabled.brand,
                  }))
                }
                id="brand-checkbox"
              />
              <label htmlFor="brand-checkbox">Бренд?</label>

              <select
                name="brand"
                value={inputValues.brand}
                onChange={(e) =>
                  setInputValues((oldInputValues) => ({
                    ...oldInputValues,
                    brand: e.target.value,
                  }))
                }
                style={!enabled.brand ? { display: "none" } : {}}
              >
                {product.brands.map((brand) => {
                  return (
                    <option key={brand.id} value={brand.name}>
                      {brand.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <img
              className="banner-img"
              src={newSrc ? newSrc : "/assets/default-img.png"}
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

            <div>
              <button onClick={() => setWhatIsShown("")}>Закрыть</button>
              <button onClick={addHandler}>Добавить</button>
            </div>
          </form>
        </div>
      </>
    )
  );
}

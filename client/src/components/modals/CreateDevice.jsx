import { observer } from "mobx-react-lite";
import react, { useContext, useState } from "react";
import { Context } from "../../index.jsx";
import { createDevice } from "../../API/deviceAPI";

export default observer(function CreateDevice({ isShown, hide }) {
  const { device } = useContext(Context);
  const [inputValues, setInputValues] = useState({
    name: "",
    price: 0,
    file: null,
  });
  const [info, setInfo] = useState([]);
  device.setSelectedType(device.types[0]);
  device.setSelectedBrand(device.brands[0]);
  function addStatHandler(e) {
    e.preventDefault();
    setInfo([...info, { title: "", description: "", number: Date.now() }]);
  }
  function removeHandler(number) {
    setInfo(info.filter((stat) => stat.number !== number));
  }
  function changeInfo(key, value, number) {
    setInfo(info.map(i=>i.number===number ? {...i, [key]: value} : i))
  }

  function selectFile(e) {
    setInputValues({ ...inputValues, file: e.target.files[0] });
  }

  function addDeviceHandler(e) {
    e.preventDefault();
    const formData = new FormData
    formData.append('name', inputValues.name)
    formData.append('price', inputValues.price)
    formData.append('img', inputValues.file)
    formData.append('brandId', device.selectedBrand.id)
    formData.append('typeId', device.selectedType.id)
    formData.append('info', JSON.stringify(info))
    createDevice(formData).then((data) => hide("device"));
    
  }

  return (
    <>
      {isShown.device && (
        <div className="modal-container">
          <div className="modal-inner-container">
            <form>
              <h2>Добавить устройство</h2>
              <select name="types">
                {device.types.map((type) => {
                  return (
                    <option
                      onClick={() => device.setSelectedType(type)}
                      key={type.id}
                    >
                      {type.name}
                    </option>
                  );
                })}
              </select>
              <select name="brands">
                {device.brands.map((brand) => {
                  return (
                    <option
                      onClick={() => device.setSelectedBrand(brand)}
                      key={brand.id}
                    >
                      {brand.name}
                    </option>
                  );
                })}
              </select>
              <input
                onChange={(e) =>
                  setInputValues({ ...inputValues, name: e.target.value })
                }
                value={inputValues.name}
                type="text"
                placeholder="Введите название устройства"
              />
              <input
                onChange={(e) =>
                  setInputValues({
                    ...inputValues,
                    price: Number(e.target.value),
                  })
                }
                value={inputValues.price}
                type="number"
                placeholder="Введите стоимость устройства"
              />
              <input onChange={selectFile} type="file" />
              <button onClick={addStatHandler}>Добавить новое свойство</button>
              {info.map((elem) => {
                return (
                  <div className="modal-stats" key={elem.number}>
                    <input
                      className="modal-stat-name"
                      type="text"
                      placeholder="Введите название свойства"
                      value={elem.title}
                      onChange={(e) =>
                        changeInfo("title", e.target.value, elem.number)
                      }
                    />
                    <input
                      className="modal-stat-value"
                      type="text"
                      placeholder="Введите значение свойства"
                      value={elem.description}
                      onChange={(e) =>
                        changeInfo("description", e.target.value, elem.number)
                      }
                    />
                    <button onClick={() => removeHandler(elem.number)}>
                      Удалить
                    </button>
                  </div>
                );
              })}
              <div>
                <button onClick={() => hide("device")}>Закрыть</button>
                <button onClick={addDeviceHandler}>Добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
});

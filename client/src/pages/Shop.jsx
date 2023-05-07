import react, { useContext, useEffect } from "react";
import { Context } from "../index";
import {observer} from "mobx-react-lite"
import {useNavigate} from 'react-router-dom'
import { API_URL, DEVICE_ROUTE } from "../utils/consts";
import { getBrands, getDevices, getTypes } from "../API/deviceAPI";
import Pages from '../components/Pages'

export default observer(function Shop() {
  const { device } = useContext(Context);
  const navigate = useNavigate()

  useEffect(() => {
    getTypes().then(data => device.setTypes(data))
    getBrands().then((data) => device.setBrands(data));
    getDevices().then((data) => {
      device.setDevices(data.rows)
      device.setTotalCount(data.count)
    });
  }, [])

  //изменение пагинации
  useEffect(() => {
    getDevices(device.selectedType.id, device.selectedBrand.id, device.page, 3).then((data) => {
      device.setDevices(data.rows);
      device.setTotalCount(data.count);
    });
  }, [device.selectedBrand, device.selectedType, device.page]);

  return (
    <div className="shop-container">
      <div className="types">
        {device.types.map((eachType) => (
          <div
            key={eachType.id}
            style={
              eachType.id === device.selectedType.id ? { color: "blue" } : {}
            }
            onClick={() => device.setSelectedType(eachType)}
          >
            {eachType.name}
          </div>
        ))}
      </div>
      <div className="main-container">
        <div className="brands">
          {device.brands.map((eachBrand) => (
            <div
              key={eachBrand.id}
              style={
                eachBrand.id === device.selectedBrand.id
                  ? { color: "blue" }
                  : {}
              }
              onClick={() => device.setSelectedBrand(eachBrand)}
            >
              {eachBrand.name}
            </div>
          ))}
        </div>
        <div className="device-cards">
          {device.devices.map((eachDevice) => (
            <div
              key={eachDevice.id}
              className="device-card"
              onClick={() => navigate(DEVICE_ROUTE + "/" + eachDevice.id)}
            >
              <img className="device-image" src={API_URL + eachDevice.img} />
              <div className="type-and-rating">
                <div className="type-brand">
                  {device.types[eachDevice.typeId].name +
                    " " +
                    device.brands[eachDevice.brandId].name}
                </div>
                <div className="rating">
                  {eachDevice.rating}
                  <img src="/assets/star.svg" />
                </div>
              </div>
              <div className="device-name">{eachDevice.name}</div>
            </div>
          ))}
        </div>
        <Pages />
      </div>
    </div>
  );
})
  


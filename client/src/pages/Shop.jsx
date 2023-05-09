import react, { useContext, useEffect } from "react";
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { API_URL, DEVICE_ROUTE, PRODUCT_IMAGE_URL } from "../utils/consts";
import { getBrands, getDevices, getTypes } from "../API/deviceAPI";
import Pagination from "../components/Pagination";
import DeviceCard from "../components/DeviceCard";

export default observer(function Shop() {
  const { device } = useContext(Context);

  useEffect(() => {
    getTypes().then((data) => device.setTypes(data));
    getBrands().then((data) => device.setBrands(data));
  }, []);

  //изменение пагинации
  useEffect(() => {
    getDevices(
      device.selectedType.id,
      device.selectedBrand.id,
      device.page,
      3
    ).then((data) => {
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
            onClick={() =>
              device.selectedType.id === eachType.id
                ? device.setSelectedType({})
                : device.setSelectedType(eachType)
            }
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
              onClick={() =>
                device.selectedBrand.id === eachBrand.id
                  ? device.setSelectedBrand({})
                  : device.setSelectedBrand(eachBrand)
              }
            >
              {eachBrand.name}
            </div>
          ))}
        </div>
        <div className="device-cards">
          {device.devices.map((eachDevice) => (
            <DeviceCard
              key={eachDevice.id}
              id={eachDevice.id}
              typeId={eachDevice.typeId}
              brandId={eachDevice.brandId}
              img={eachDevice.img}
              rating={eachDevice.rating}
            />
          ))}
        </div>
        <Pagination />
      </div>
    </div>
  );
});

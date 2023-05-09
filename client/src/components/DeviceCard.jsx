import react, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import { API_URL, PRODUCT_IMAGE_URL, DEVICE_ROUTE } from "../utils/consts";

export default observer(function DeviceCard({
  id,
  typeId,
  brandId,
  img,
  rating,
}) {
  const { device } = useContext(Context);
  const navigate = useNavigate();
  return (
    <div
      className="device-card"
      onClick={() => navigate(DEVICE_ROUTE + "/" + id)}
    >
      <img className="device-image" src={API_URL + PRODUCT_IMAGE_URL + img} />
      <div className="type-and-rating">
        <div className="type-brand">
          {device.types.find((type) => type.id === typeId).name +
            " " +
            device.brands.find((brand) => brand.id === brandId).name}
        </div>
        <div className="rating">
          {rating}
          <img src="/assets/star.svg" />
        </div>
      </div>
      <div className="device-name">{name}</div>
    </div>
  );
});


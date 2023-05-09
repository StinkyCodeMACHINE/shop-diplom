import react, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
import { getOneDevice } from "../API/deviceAPI";
import { API_URL, PRODUCT_IMAGE_URL } from "../utils/consts";

export default function DevicePage() {
  const [device, setDevice] = useState({info: []})
  const {id} = useParams()

  useEffect(() => {
    getOneDevice(id).then((data) => setDevice(data));
  }, []);

  return (
    device.img && 
    (
      <div className="device-page-main-container">
        <div className="device-page-top-container">
          <img
            src={device.img ? API_URL + PRODUCT_IMAGE_URL + device.img : ""}
            className="device-page-img"
          />
          <div className="device-page-name-and-rating">
            <div className="device-page-name">{device.name}</div>
            <div className="device-page-rating">{device.rating}</div>
          </div>
          <div className="device-page-add-to-card-container">
            <div>От {device.price} руб.</div>
            <button>Добавить в корзину</button>
          </div>
        </div>
        <div className="device-page-bottom-container">
          <h2>Характеристики: </h2>
          <div className="device-page-stats">
            {device.info.map((stat) => {
              return (
                <div
                  key={stat.id}
                  style={stat.id % 2 === 1 ? { backgroundColor: "white" } : {}}
                  className="device-page-stat"
                >
                  {stat.title}: {stat.description}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )
  );
}

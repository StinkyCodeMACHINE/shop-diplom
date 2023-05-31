import react, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder, getOneProduct } from "../API/productAPI";
import { Context } from "../App";
import { API_URL, PROFILE_IMAGE_URL, } from "../utils/consts";
import { nanoid } from "nanoid";
import { getOrders } from "../API/productAPI";
import { changeProfile, getUserInfo } from "../API/userAPI";

export default function Profile() {
  const { product, setProduct, user, whatIsShown, setWhatIsShown } =
    useContext(Context);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [userElem, setUserElem] = useState({}) 
  const [inputValues, setInputValues] = useState({
    phone: "",
    name: "",
    oldPassword: "",
    newPassword: "",
    file: null
  });

  useEffect(() => {
    async function apiCalls() {
      const user = await getUserInfo()
      await setUserElem(user)
    }

    apiCalls();
  }, []);

  async function inputChangeHandler(e) {
    if (e.target.id === "phone") {
      setInputValues((oldInputValues) => ({
        ...oldInputValues,
        phone:
          e.target.value.length === 1 && e.target.value !== "8"
            ? `89${e.target.value}`
            : e.target.value === "89"
            ? ""
            : e.target.value,
      }));
    } else {
      setInputValues((oldInputValues) => ({
        ...oldInputValues,
        [e.target.id]: e.target.value,
      }));
    }
  }

  async function addProductHandler(e) {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", inputValues.name);
    formData.append("price", inputValues.price);
    for (let i = 0; i < inputValues.files.length; i++) {
      formData.append("img", inputValues.files[i]);
    }
    formData.append(
      "brandId",
      product.brands.find((brand) => brand.name === inputValues.brand).id
    );
    formData.append(
      "typeId",
      product.types.find((type) => type.name === inputValues.type).id
    );
    formData.append("info", JSON.stringify([...defaultInfo, ...info]));
    await changeProfile(formData);
    await setInputValues({
      phone: "",
      name: "",
      oldPassword: "",
      newPassword: "",
      file: null,
    });

  }

  return (
    <div className="profile-page">
      <h2>Настройка профиля</h2>
      <div className="profile-page-img-container">
        <h3>Изображение профиля</h3>
        <img
          src={
            userElem.img
              ? API_URL + PROFILE_IMAGE_URL + userElem.img
              : "/assets/default-profile-pic.png"
          }
        />
        <div>
          <label htmlFor="upload">
            <div>Загрузить изображение</div>
            <input
              id="upload"
              style={{ display: "none" }}
              onChange={async (e) => {
                // await setInputValues((prevInputValues) => ({
                //   ...prevInputValues,
                //   file: e.target.files[0],
                // }));
                const formData = new FormData();
                formData.append("img", e.target.files[0]);
                const profile = await changeProfile(formData);
                await setInputValues((oldInputValues) => ({
                  ...oldInputValues,
                  file: null,
                }));
                await setUserElem(profile);
              }}
              type="file"
            />
          </label>
        </div>
      </div>
      <div className="profile-page-name-container">
        <h3>Имя</h3>
        <div>{userElem.name}</div>
        <input
          placeholder="Введите новое имя"
          id="name"
          type="text"
          value={inputValues.name}
          onChange={inputChangeHandler}
        />
        <button
          onClick={async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("name", inputValues.name);
            const profile = await changeProfile(formData);
            await setInputValues((oldInputValues) => ({
              ...oldInputValues,
              name: "",
            }));
            await setUserElem(profile);
          }}
        >
          Изменить имя
        </button>
      </div>
      <div className="profile-page-password-container">
        <div>
          <input
            placeholder="Введите старый пароль"
            id="oldPassword"
            type="password"
            value={inputValues.oldPassword}
            onChange={inputChangeHandler}
          />
          <input
            placeholder="Введите новый пароль"
            id="newPassword"
            type="password"
            value={inputValues.newPassword}
            onChange={inputChangeHandler}
          />
        </div>
        <button
          onClick={async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("oldPassword", inputValues.oldPassword);
            formData.append("newPassword", inputValues.newPassword);
            const profile = await changeProfile(formData);
            await setInputValues((oldInputValues) => ({
              ...oldInputValues,
              oldPassword: "",
              newPassword: "",
            }));
            await setUserElem(profile);
          }}
        >
          Изменить пароль
        </button>
      </div>
      <div className="profile-page-phone-container">
        <h3>Номер телефона</h3>
        <div>Старый номер: {userElem.phone ? userElem.phone : "отсутствует!"}</div>
        <div>
          <input
            onChange={inputChangeHandler}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            value={inputValues.phone}
            type="tel"
            id="phone"
            maxLength={11}
            placeholder="Введите новый номер телефона"
          />
          <button
            onClick={async (e) => {
              e.preventDefault();
              const formData = new FormData();
              formData.append("phone", inputValues.phone);
              const profile = await changeProfile(formData);
              await setInputValues((oldInputValues) => ({
                ...oldInputValues,
                phone: "",
              }));
              await setUserElem(profile);
            }}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

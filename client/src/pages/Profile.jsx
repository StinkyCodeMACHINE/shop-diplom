import react, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder, getOneProduct } from "../API/productAPI";
import { Context } from "../App";
import { API_URL, PROFILE_IMAGE_URL } from "../utils/consts";
import { nanoid } from "nanoid";
import { getOrders } from "../API/productAPI";
import { changeProfile, getUserInfo } from "../API/userAPI";

export default function Profile() {
  const { product, setProduct, user, setUser, whatIsShown, setWhatIsShown } =
    useContext(Context);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [errorPopUp, setErrorPopUp] = useState(false);
  const [areEmpty, setAreEmpty] = useState({
    phone: false,
    name: false,
    oldPassword: false,
    newPassword: false,
  });
  const [userElem, setUserElem] = useState({ border: "1px solid transparent" });
  const [inputValues, setInputValues] = useState({
    phone: "",
    name: "",
    oldPassword: "",
    newPassword: "",
    file: null,
  });

  useEffect(() => {
    async function apiCalls() {
      const user = await getUserInfo();
      await setUserElem(user);
    }

    apiCalls();
  }, []);

  useEffect(() => {
    async function apiCalls() {
      const timer = setTimeout(
        () => setErrorPopUp(false),
        1500
      );
      
      return () => {
        clearTimeout(timer);
      };
    }

    errorPopUp && apiCalls();
  }, [errorPopUp]);

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

  return (
    <div className="profile-page">
      <h2>Настройка профиля</h2>
      <div className="profile-page-img-and-pic-container">
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
              <div className="product-option-container">
                <div>Загрузить изображение</div>
              </div>
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
                  await setUser({ user: profile, isAuth: true });
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
            style={
              areEmpty.name
                ? { border: "1px solid var(--cred)" }
                : { border: "1px solid transparent" }
            }
            placeholder="Введите новое имя"
            id="name"
            type="text"
            value={inputValues.name}
            onChange={inputChangeHandler}
          />
          <div
            onClick={async (e) => {
              e.preventDefault();
              if (inputValues.name) {
                await setAreEmpty((oldAreEmpty) => ({
                  ...oldAreEmpty,
                  name: false,
                }));

                const formData = new FormData();
                formData.append("name", inputValues.name);
                const profile = await changeProfile(formData);
                await setInputValues((oldInputValues) => ({
                  ...oldInputValues,
                  name: "",
                }));
                await setUserElem(profile);
                await setUser({ user: profile, isAuth: true });
              } else {
                await setAreEmpty((oldAreEmpty) => ({
                  ...oldAreEmpty,
                  name: true,
                }));
              }
            }}
            className="product-option-container"
          >
            <div>Изменить имя</div>
          </div>
        </div>
      </div>

      <div className="profile-page-password-container">
        <div>
          <div>
            <h3>Старый пароль</h3>
            <input
              style={
                areEmpty.oldPassword
                  ? { border: "1px solid var(--cred)" }
                  : { border: "1px solid transparent" }
              }
              placeholder="Введите старый пароль"
              id="oldPassword"
              type="password"
              value={inputValues.oldPassword}
              onChange={inputChangeHandler}
            />
          </div>
          <div>
            <h3>Новый пароль</h3>
            <input
              style={
                areEmpty.newPassword
                  ? { border: "1px solid var(--cred)" }
                  : { border: "1px solid transparent" }
              }
              placeholder="Введите новый пароль"
              id="newPassword"
              type="password"
              value={inputValues.newPassword}
              onChange={inputChangeHandler}
            />
          </div>
        </div>
        <div
          onClick={async (e) => {
            e.preventDefault();
            if (inputValues.oldPassword && inputValues.newPassword) {
              try {
                await setAreEmpty((oldAreEmpty) => ({
                  ...oldAreEmpty,
                  oldPassword: false,
                  newPassword: false,
                }));

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
                await setUser({ user: profile, isAuth: true });
              } catch (err) {
                setErrorPopUp(true);
              }
            } else {
              await setAreEmpty((oldAreEmpty) => ({
                ...oldAreEmpty,
                oldPassword: !inputValues.oldPassword ? true : false,
                newPassword: !inputValues.newPassword ? true : false,
              }));
            }
          }}
          className="product-option-container"
        >
          <div>Изменить пароль</div>
        </div>
      </div>
      <div className="profile-page-phone-container">
        <h3>Номер телефона</h3>
        <div>
          Старый номер: {userElem.phone ? userElem.phone : "отсутствует!"}
        </div>
        <div>
          <input
            style={
              areEmpty.phone
                ? { border: "1px solid var(--cred)" }
                : { border: "1px solid transparent" }
            }
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
          <div
            onClick={async (e) => {
              e.preventDefault();
              if (inputValues.phone) {
                await setAreEmpty((oldAreEmpty) => ({
                  ...oldAreEmpty,
                  phone: false,
                }));
                const formData = new FormData();
                formData.append("phone", inputValues.phone);
                const profile = await changeProfile(formData);
                await setInputValues((oldInputValues) => ({
                  ...oldInputValues,
                  phone: "",
                }));
                await setUserElem(profile);
                await setUser({ user: profile, isAuth: true });
              } else {
                await setAreEmpty((oldAreEmpty) => ({
                  ...oldAreEmpty,
                  phone: true,
                }));
              }
            }}
            className="product-option-container"
          >
            <div>Изменить номер телефона</div>
          </div>
        </div>
      </div>
      <div
        style={errorPopUp ? { opacity: "1" } : { opacity: "0" }}
        id="error-pop-up"
      >
        Неверно введён пароль
      </div>
    </div>
  );
}

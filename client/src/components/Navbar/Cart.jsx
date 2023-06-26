import react, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder, getOneProduct } from "../../API/productAPI";
import { Context } from "../../App";
import { API_URL, PRODUCT_IMAGE_URL, PRODUCT_ROUTE } from "../../utils/consts";
import { nanoid } from "nanoid";

export default function Cart() {
  const { product, setProduct, user, whatIsShown, setWhatIsShown } =
    useContext(Context);
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [currentlyShown, setCurrentlyShown] = useState("cart");
  const [loading, setLoading] = useState(false);
  const [inputValues, setInputValues] = useState({
    phone: user.user.phone,
    email: user.user.email,
    name: "",
    address: "",
  });

  useEffect(() => {
    async function apiCalls() {
      let cartArray = [];
      let remove = [];
      for (let i = 0; i < product.cart.length; i++) {
        const productData = await getOneProduct(product.cart[i]);
        if (productData.left !== null && productData.left === 0) {
          remove.push(productData.id);
        } else {
          cartArray.push({
            ...productData,
            left: productData.left === null ? 99 : productData.left,
            amount: 1,
            finalPrice: productData.discount
              ? Math.ceil(productData.price * productData.discount)
              : Math.ceil(productData.price),
          });
        }
        if (remove.length > 0) {
          setProduct((oldProduct) => ({
            ...oldProduct,
            cart: oldProduct.cart.flatMap((id) =>
              id !== productData.id ? id : []
            ),
          }));
        }
      }
      setCart(cartArray);
    }

    product.cart.length > 0 ? apiCalls() : setCart([]);
  }, [product.cart]);

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
    <div onClick={(e) => e.stopPropagation()} className="cart-container">
      {currentlyShown === "cart" && (
        <div className="cart">
          <h2>Корзина</h2>
          <div className="cart-body">
            {cart.length > 0 ? (
              cart.map((cartElem) => (
                <div className="cart-product-card">
                  <img
                    onClick={() => {
                      navigate(PRODUCT_ROUTE + "/" + cartElem.id, {
                        state: nanoid(), //для ререндера той же страницы
                      });
                      setWhatIsShown("");
                    }}
                    className="product-image"
                    src={API_URL + PRODUCT_IMAGE_URL + cartElem.img[0]}
                  />
                  <div>{cartElem.name}</div>
                  <div className="cart-plus-minus-count">
                    <img
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          cart.find((elem) => elem.id === cartElem.id)
                            .amount === 1
                        ) {
                          setProduct((oldProduct) => ({
                            ...oldProduct,
                            cart: oldProduct.cart.filter(
                              (productElem) => productElem !== cartElem.id
                            ),
                          }));
                        } else {
                          setCart((oldCart) =>
                            oldCart.map((elem) =>
                              elem.id === cartElem.id
                                ? {
                                    ...elem,
                                    amount: elem.amount - 1,
                                    finalPrice: elem.discount
                                      ? Math.ceil(elem.price *
                                        elem.discount *
                                        (elem.amount - 1))
                                      : elem.price * (elem.amount - 1),
                                  }
                                : elem
                            )
                          );
                        }
                      }}
                      src="/assets/minus.png"
                    />
                    <input
                      value={
                        cart.find((elem) => elem.id === cartElem.id) &&
                        cart.find((elem) => elem.id === cartElem.id).amount
                      }
                      onChange={(e) =>
                        setCart((oldCart) =>
                          oldCart.map((elem) =>
                            elem.id === cartElem.id
                              ? {
                                  ...elem,
                                  amount:
                                    Number(e.target.value) > 0
                                      ? Number(e.target.value) <= cartElem.left
                                        ? Number(e.target.value)
                                        : cartElem.left
                                      : 1,
                                  finalPrice: elem.discount
                                    ? Number(e.target.value) > 0
                                      ? Math.ceil(elem.price *
                                        elem.discount *
                                        Number(e.target.value))
                                      : Math.ceil(elem.price * elem.discount)
                                    : Number(e.target.value) > 0
                                    ? elem.price * Number(e.target.value)
                                    : elem.price * 1,
                                }
                              : elem
                          )
                        )
                      }
                      type="text"
                    />

                    <img
                      onClick={(e) => {
                        e.preventDefault();
                        setCart((oldCart) =>
                          oldCart.map((elem) =>
                            elem.id === cartElem.id
                              ? {
                                  ...elem,
                                  amount:
                                    elem.amount + 1 <= cartElem.left
                                      ? elem.amount + 1
                                      : cartElem.left,
                                  finalPrice: elem.discount
                                    ? Math.ceil(elem.price *
                                      elem.discount *
                                      (elem.amount + 1))
                                    : elem.price * (elem.amount + 1),
                                }
                              : elem
                          )
                        );
                      }}
                      src="/assets/plus.png"
                    />
                  </div>
                  <div className="cart-price">
                    <div>
                      Цена:{" "}
                      <span>
                        {Math.ceil(cartElem.finalPrice)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                        &#x20BD;
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h3>Корзина пуста!</h3>
            )}
          </div>
          {cart.length > 0 && (
            <div className="cart-results">
              <div className="cart-results-products">
                Товаров:{" "}
                {cart.length > 0 &&
                  cart.reduce(
                    (totalAmount, elem) => totalAmount + elem.amount,
                    0
                  )}
              </div>
              <div className="cart-results-money">
                Сумма:{" "}
                {cart.length > 0 &&
                  cart
                    .reduce(
                      (money, elem) => money + Math.ceil(elem.finalPrice),
                      0
                    )
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                &#x20BD;
              </div>
            </div>
          )}
          <div className="cart-options">
            <div
              onClick={(e) => {
                e.preventDefault();
                setWhatIsShown("");
              }}
              className="product-option-container"
            >
              <div>Закрыть</div>
            </div>

            {cart.length > 0 && (
              <>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentlyShown("confirmation");
                  }}
                  className="product-option-container"
                >
                  <img
                    className="product-heart product-heart-empty"
                    src="/assets/cart.svg"
                  />
                  <div>Оформить заказ</div>
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentlyShown("confirmation");
                  }}
                  className="product-option-container"
                >
                  <img
                    style={{
                      width: "30px",
                      height: "30px",
                      filter: "var(--cred-filter)",
                    }}
                    className="product-heart product-heart-empty"
                    src="/assets/delete.png"
                  />
                  <div>Отчистить корзину</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {(currentlyShown === "confirmation" || currentlyShown === "allgood") && (
        <div className="confirmation">
          <h2>Подтвердите данные</h2>
          {!loading ? (
            currentlyShown === "allgood" ? (
              <div>
                <h2>Заказ успешно оформлен!</h2>Заказ успешно оформлен!
              </div>
            ) : (
              <>
                <form>
                  <h3>Фио</h3>
                  <input
                    onChange={inputChangeHandler}
                    value={inputValues.name}
                    type="text"
                    id="name"
                    placeholder="Введите ФИО..."
                  />
                  <h3>Номер телефона</h3>
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
                    placeholder="89525473419"
                  />
                  <h3>Адрес проживания</h3>

                  <input
                    onChange={inputChangeHandler}
                    value={inputValues.address}
                    type="text"
                    id="address"
                    placeholder="Ввведите ваш адрес..."
                  />
                  <h3>Адрес электронной почты</h3>
                  <input
                    onChange={inputChangeHandler}
                    value={inputValues.email}
                    type="text"
                    id="email"
                    placeholder="Введите вашу почту..."
                  />
                </form>
                <div
                  onClick={async (e) => {
                    try {
                      e.preventDefault();
                      await setLoading(true);
                      const order = await createOrder({ cart, ...inputValues });
                      await setProduct((oldProduct) => ({
                        ...oldProduct,
                        cart: [],
                      }));
                      await setLoading(false);
                      await setCurrentlyShown("allgood");
                    } catch (err) {}
                  }}
                  className="product-option-container"
                >
                  <div className="product-heart-text">Подтвердить данные</div>
                </div>
              </>
            )
          ) : (
            <div>Загрузка</div>
          )}
        </div>
      )}
    </div>
  );
}

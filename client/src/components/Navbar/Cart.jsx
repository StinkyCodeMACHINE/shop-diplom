import react, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getOneProduct } from "../../API/productAPI";
import { Context } from "../../App";
import { API_URL, PRODUCT_IMAGE_URL, PRODUCT_ROUTE } from "../../utils/consts";
import { nanoid } from "nanoid";

export default function Cart() {
  const { product, setProduct, whatIsShown, setWhatIsShown } =
    useContext(Context);
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("1");
  const [cart, setCart] = useState([]);

  //   //для теста
  //   useEffect(() => {
  //     async function apiCalls() {
  //       await setProduct((oldProduct) => ({
  //         ...oldProduct,
  //         cart: [31, 32],
  //       }));
  //     }

  //     apiCalls();
  //   }, []);

  useEffect(() => {
    async function apiCalls() {
      let cartArray = [];
      for (let i = 0; i < product.cart.length; i++) {
        const productData = await getOneProduct(product.cart[i]);
        cartArray.push({
          ...productData,
          amount: 1,
          finalPrice: productData.discount
            ? productData.price * productData.discount
            : productData.price,
        });
      }
      setCart(cartArray);
    }

    product.cart.length > 0 ? apiCalls() : setCart([]);
  }, [product.cart]);

  return (
    <div className="cart-container">
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
                        cart.find((elem) => elem.id === cartElem.id).amount ===
                        1
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
                                    ? elem.price *
                                      elem.discount *
                                      (elem.amount - 1)
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
                                amount: e.target.value > 0 ? e.target.value : 1,
                                finalPrice: elem.discount
                                  ? e.target.value > 0
                                    ? elem.price *
                                      elem.discount *
                                      e.target.value
                                    : elem.price * elem.discount
                                  : e.target.value > 0
                                  ? elem.price * e.target.value
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
                                amount: elem.amount + 1,
                                finalPrice: elem.discount
                                  ? elem.price *
                                    elem.discount *
                                    (elem.amount + 1)
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
                      {cartElem.finalPrice
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
                cart.reduce((money, elem) => money + elem.finalPrice, 0)}
            </div>
          </div>
        </div>
        <div className="cart-options">
          <button
            onClick={(e) => {
              e.preventDefault();
              setWhatIsShown("");
            }}
          >
            Закрыть
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setWhatIsShown("");
            }}
          >
            Оформить заказ
          </button>
          <button
            onClick={async (e) => {
              e.preventDefault();
              setCart([]);
              setProduct((oldProduct) => ({ ...oldProduct, cart: [] }));
            }}
          >
            Отчистить корзину
          </button>
        </div>
      </div>
    </div>
  );
}

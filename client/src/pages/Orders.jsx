import react, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder, getOneProduct } from "../API/productAPI";
import { Context } from "../App";
import { API_URL, PRODUCT_IMAGE_URL, PRODUCT_ROUTE } from "../utils/consts";
import { nanoid } from "nanoid";
import { getOrders } from "../API/productAPI";
import DefaultPagination from "../components/DefaultPagination";

export default function Cart() {
  const { product, setProduct, user, whatIsShown, setWhatIsShown } =
    useContext(Context);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
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
  const [dbResults, setDbResults] = useState([])
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    async function apiCalls() {
      let orders = await getOrders();
      orders = orders.flatMap((elem) =>
      elem.orderProducts.length === 0 ? [] : elem
      );
      await setDbResults(orders)
      await setTotalCount(orders.length)
      let limitedOrders = []
      
      //
      let offset = page * limit - limit
      for (let i=offset;i<offset+limit && i<orders.length; i++) {
        limitedOrders.push(orders[i])
      }
      await setOrders(limitedOrders);
    }

    apiCalls();
  }, [product.cart]);

  useEffect(() => {
    async function apiCalls() {
      let limitedOrders = [];

      //
      let offset = page * limit - limit;
      for (let i = offset; i < offset + limit && i < dbResults.length; i++) {
        limitedOrders.push(dbResults[i]);
      }
      await setOrders(limitedOrders);
    }

    dbResults.length>0 && apiCalls();
  }, [page]);

  return (
    <div className="orders-page-main-container">
      <h2>Заказы</h2>
      {orders.length > 0 &&
        orders.map((orderElem) => (
          <div className="orders-page-order-container">
            <h3>Заказ № {orderElem.id}</h3>
            {orderElem.orderProducts.map((orderProductElem) => {
              return (
                <>
                  <div
                    key={orderProductElem.id}
                    className="orders-page-product-container"
                  >
                    <img
                      onClick={() => {
                        navigate(
                          PRODUCT_ROUTE + "/" + orderProductElem.product.id,
                          {
                            state: nanoid(), //для ререндера той же страницы
                          }
                        );
                        setWhatIsShown("");
                      }}
                      className="product-image"
                      src={
                        API_URL +
                        PRODUCT_IMAGE_URL +
                        orderProductElem.product.img[0]
                      }
                    />
                    <div>{orderProductElem.product.name}</div>
                    <div>
                      <div>
                        Цена:{" "}
                        <span>
                          {orderProductElem.price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                          &#x20BD;
                        </span>
                      </div>
                    </div>
                    <div>
                      <div>
                        Колво: <span>{orderProductElem.amount}</span>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
            <div className="order-results">
              <div className="order-results-overall">Итого: </div>
              <div>
                <div>
                  Товаров:{" "}
                  {orderElem.orderProducts.reduce(
                    (totalAmount, elem) => totalAmount + elem.amount,
                    0
                  )}
                </div>
                <div>
                  Сумма:{" "}
                  {orderElem.money
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                  &#x20BD;
                </div>
                <div>
                  Адрес: <span>{orderElem.address}</span>
                </div>
                <div>
                  Дата оформления:{" "}
                  {`${new Date(orderElem.createdAt).getDate()}.${new Date(
                    orderElem.createdAt
                  ).getMonth()}.${new Date(orderElem.createdAt).getFullYear()}`}
                </div>
                <div>
                  Статус: <span>{orderElem.status.toLowerCase()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      {orders.length > 0 && (
        <DefaultPagination
          page={page}
          setPage={setPage}
          limit={limit}
          totalCount={totalCount}
        />
      )}
    </div>
  );
}

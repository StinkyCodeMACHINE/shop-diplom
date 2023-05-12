import React, { useContext } from "react";
import { Context } from "../../App";

export default function Pagination() {
  const { product, setProduct } = useContext(Context);

  const pageCount = Math.ceil(product.totalCount / product.limit);
  const pages = [];
  for (let i = 0; i < pageCount; i++) {
    pages.push(i + 1);
  }

  console.log("pages last: " + pages[pages.length - 1]);

  return (
    <div className="pagination">
      <div
        className="page-number"
        onClick={() =>
          setProduct((oldProduct) => ({ ...oldProduct, page: pages[0] }))
        }
      >
        {"<<"}
      </div>
      <div
        className="page-number"
        onClick={() => {
          setProduct((oldProduct) => ({
            ...oldProduct,
            page: oldProduct.page > 1 ? oldProduct.page - 1 : oldProduct.page,
          }));
        }}
      >
        {"<"}
      </div>
      {pages.map((page) => (
        <div
          key={page}
          onClick={() =>
            setProduct((oldProduct) => ({ ...oldProduct, page: page }))
          }
          style={
            product.page === page
              ? { backgroundColor: "blue", color: "white" }
              : {}
          }
          className="page-number"
        >
          {page}
        </div>
      ))}

      <div
        className="page-number"
        onClick={() =>
          setProduct((oldProduct) => ({
            ...oldProduct,
            page:
              oldProduct.page !== pages[pages.length - 1]
                ? oldProduct.page + 1
                : oldProduct.page,
          }))
        }
      >
        {">"}
      </div>
      <div
        className="page-number"
        onClick={() =>
          setProduct((oldProduct) => ({
            ...oldProduct,
            page: pages[pages.length - 1],
          }))
        }
      >
        {">>"}
      </div>
    </div>
  );
}

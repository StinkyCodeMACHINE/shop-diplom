import React, { useContext, useState } from "react";
import { Context } from "../../App";

export default function Pagination() {
  const { product, setProduct } = useContext(Context);

  // const [ pages, setPages] = useState([])

  const pageCount = Math.ceil(product.totalCount / product.limit);
  const pages = [];
  if (product.page >= 4) {
    pages.push(product.page - 3);
    pages.push(product.page - 2);
    pages.push(product.page - 1);
    for (let i = product.page - 1; i < pageCount && i < product.page + 3; i++) {
      pages.push(i + 1);
    }
  } else {
    for (let i = 0; i < pageCount && i < 7; i++) {
      pages.push(i + 1);
    }
  }

  return (
    <div className="pagination">
      <div
        className="page-number"
        onClick={() => setProduct((oldProduct) => ({ ...oldProduct, page: 1 }))}
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
            page: pageCount,
          }))
        }
      >
        {">>"}
      </div>
    </div>
  );
}

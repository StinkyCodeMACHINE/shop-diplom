import React, { useContext, useState } from "react";
import { Context } from "../../App";

export default function Pagination() {
  const { product, setProduct } = useContext(Context);

  // const [ pages, setPages] = useState([])

  const pageCount = Math.ceil(product.totalCount / product.limit);
  const pages = [];
  const pageLimit = 7
  let pagesLeft = pageLimit-1
  for (let i = 1; i <= pageLimit/2 && (product.page-i) > 0; i++) {
    pages.unshift(product.page-i)
    pagesLeft = pagesLeft - 1
  }
  pages.push(product.page)
  for (let i = 1; i <= pageLimit / 2 && (product.page + i) <= pageCount; i++) {
    pages.push(product.page + i);
    pagesLeft = pagesLeft - 1
  }
  if (pagesLeft > 0) {
    for (let i = Math.ceil(pageLimit/2); product.page - i > 0 && pagesLeft>0; i++) {
      pages.unshift(product.page - i);
          pagesLeft = pagesLeft - 1;
    }
    for (let i = Math.ceil(pageLimit / 2); product.page + i <= pageCount && pagesLeft>0; i++) {
      pages.push(product.page + i);
          pagesLeft = pagesLeft - 1;
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

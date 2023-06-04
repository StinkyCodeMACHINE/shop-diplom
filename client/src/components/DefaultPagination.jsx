import React, { useContext, useState } from "react";
import { Context } from "../App";

export default function DefaultPagination({ page, setPage, limit, totalCount }) {
  const { product, setProduct } = useContext(Context);

  // const [ pages, setPages] = useState([])

  const pageCount = Math.ceil(totalCount / limit);
  const pages = [];
  const pageLimit = 7;
  let pagesLeft = pageLimit - 1;
  for (let i = 1; i <= pageLimit / 2 && page - i > 0; i++) {
    pages.unshift(page - i);
    pagesLeft = pagesLeft - 1;
  }
  pages.push(page);
  for (let i = 1; i <= pageLimit / 2 && page + i <= pageCount; i++) {
    pages.push(page + i);
    pagesLeft = pagesLeft - 1;
  }
  if (pagesLeft > 0) {
    for (let i = Math.ceil(pageLimit / 2); page - i > 0 && pagesLeft > 0; i++) {
      pages.unshift(page - i);
      pagesLeft = pagesLeft - 1;
    }
    for (
      let i = Math.ceil(pageLimit / 2);
      page + i <= pageCount && pagesLeft > 0;
      i++
    ) {
      pages.push(page + i);
      pagesLeft = pagesLeft - 1;
    }
  }

  return (
    <div className="pagination">
      <div className="page-number" onClick={async () => await setPage(1)}>
        <img
          className="pagination-arrow pagination-arrow-left"
          src="/assets/double-arrow.png"
        />
      </div>
      <div
        className="page-number"
        onClick={async () => {
          await setPage((oldPage) => (oldPage > 1 ? oldPage - 1 : oldPage));
        }}
      >
        <img
          className="pagination-arrow pagination-arrow-left"
          src="/assets/arrow.png"
        />
      </div>
      {pages.map((pageElem) => (
        <div
          key={pageElem}
          onClick={async () => await setPage(pageElem)}
          style={
            pageElem === page
              ? {
                  backgroundColor: "var(--cool-blue)",
                  color: "white",
                }
              : {}
          }
          className="page-number"
        >
          {pageElem}
        </div>
      ))}

      <div
        className="page-number"
        onClick={async () =>
          await setPage((oldPage) =>
            oldPage !== pages[pages.length - 1] ? oldPage + 1 : oldPage
          )
        }
      >
        <img className="pagination-arrow" src="/assets/arrow.png" />
      </div>
      <div
        className="page-number"
        onClick={async () => await setPage(pageCount)}
      >
        <img className="pagination-arrow" src="/assets/double-arrow.png" />
      </div>
    </div>
  );
}

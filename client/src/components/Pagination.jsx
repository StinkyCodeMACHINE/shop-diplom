import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

export default observer(function Pagination() {
  const { device } = useContext(Context);
  const pageCount = Math.ceil(device.totalCount / device.limit)
  const pages = []
  for (let i=0; i<pageCount; i++) {
    pages.push(i+1)
  }
  return (
    <div className="pagination">
      <div className="page-number">{"<<"}</div>
      <div className="page-number">{"<"}</div>
      {pages.map((page) => (
        <div key={page}
          onClick={() => device.setPage(page)}
          style={
            device.page === page
              ? { backgroundColor: "blue", color: "white" }
              : {}
          }
          className="page-number"
        >
          {page}
        </div>
      ))}
      <div className="page-number">{">"}</div>
      <div className="page-number">{">>"}</div>
    </div>
  );
});

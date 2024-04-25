import { Pagination } from "@mui/material";
import React from "react";

function PaginationFilter(props) {
  const {
    pagination,
    currentPage,
    setCurrentPage,
    setPagedata,
    searchParams,
    replace,
    filteringData,
  } = props;
  const parsedCurrentPage = parseInt(currentPage);
  return (
    <Pagination
      count={pagination?.pageCount}
      page={parsedCurrentPage}
      showFirstButton
      showLastButton
      onChange={async (event, page) => {
        const filteredData = await filteringData(
          { page },
          searchParams,
          replace
        );
        setPagedata(filteredData);
        setCurrentPage(filteredData.meta.page);
      }}
    />
  );
}

export default PaginationFilter;

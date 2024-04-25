import React from "react";
import SearchFilter from "./SearchFilter";
import SelectFilter from "./SelectFilter";
import StatusFilter from "./StatusFilter";
import OrderFilter from "./OrderFilter";
import RowsPerpageFilter from "./RowsPerPageFilter";
import PaginationFilter from "./PaginationFilter";
import AvailabilityFilter from "./AvailabilityFilter";

function FiltersControls(props) {
  const { control, ...rest } = props;
  switch (control) {
    case "search":
      return <SearchFilter {...rest} />;
    case "select":
      return <SelectFilter {...rest} />;
    case "status":
      return <StatusFilter />;
    case "availability":
      return <AvailabilityFilter />;
    case "orderBy": // will do it later with buttons
    case "order":
      return <OrderFilter />;
    case "take":
      return <RowsPerpageFilter {...rest} />;
    case "page":
      return <PaginationFilter {...rest} />;
    default:
      return null;
  }
}

export default FiltersControls;

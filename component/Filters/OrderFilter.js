import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Field } from "formik";
import React from "react";

function OrderFilter() {
  return (
    <FormControl fullWidth>
      <InputLabel id="orderLabel">Order</InputLabel>
      <Field as={Select} name="order" labelId="orderLabel" label="Order">
        <MenuItem value={""}>None</MenuItem>
        <MenuItem value="ASC">Ascending</MenuItem>
        <MenuItem value="DESC">Descending</MenuItem>
      </Field>
    </FormControl>
  );
}

export default OrderFilter;

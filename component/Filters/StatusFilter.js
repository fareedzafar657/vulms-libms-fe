import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Field } from "formik";
import React from "react";

function StatusFilter() {
  return (
    <FormControl fullWidth>
      <InputLabel id="statusLabel">Status</InputLabel>
      <Field as={Select} name="status" labelId="statusLabel" label="Status">
        <MenuItem value={""}>None</MenuItem>
        <MenuItem value={1}>Active</MenuItem>
        <MenuItem value={true}>Inactive</MenuItem>
      </Field>
    </FormControl>
  );
}

export default StatusFilter;

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Field } from "formik";
import React from "react";

function AvailabilityFilter() {
  return (
    <FormControl fullWidth>
      <InputLabel id="statusLabel">Status</InputLabel>
      <Field
        as={Select}
        name="availability"
        labelId="AvailabilityLabel"
        label="availability"
      >
        <MenuItem value={""}>Select</MenuItem>
        <MenuItem value={1}>Availability</MenuItem>
        <MenuItem value={true}>Issuance</MenuItem>
      </Field>
    </FormControl>
  );
}

export default AvailabilityFilter;

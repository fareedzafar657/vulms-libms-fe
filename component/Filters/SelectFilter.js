import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Field } from "formik";
import React from "react";

function SelectFilter(props) {
  const { label, name, labelId, options, ...rest } = props;
  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Field as={Select} name={name} labelId={labelId} label={label} {...rest}>
        <MenuItem value={""}>Select</MenuItem>
        {options?.map((option) => (
          <MenuItem key={option.name} value={option.name}>
            {option.name}
          </MenuItem>
        ))}
      </Field>
    </FormControl>
  );
}

export default SelectFilter;

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Field } from "formik";
import React from "react";

function SelectWithObject(props) {
  const { label, name, labelId, options, ...rest } = props;
  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Field as={Select} name={name} labelId={labelId} label={label} {...rest}>
        {options?.map((option) => (
          <MenuItem key={option.id} value={option}>
            {option.name}
          </MenuItem>
        ))}
      </Field>
    </FormControl>
  );
}

export default SelectWithObject;

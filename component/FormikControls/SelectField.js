import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Field } from "formik";
import React from "react";

function SelectField(props) {
  const { label, name, labelId, options, ...rest } = props;
  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Field as={Select} name={name} labelId={labelId} label={label} {...rest}>
        <MenuItem value={""}>Select</MenuItem>
        {options?.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </Field>
    </FormControl>
  );
}

export default SelectField;

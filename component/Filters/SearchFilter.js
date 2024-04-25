import { FormControl, TextField } from "@mui/material";
import { Field } from "formik";
import React from "react";

function SearchFilter(props) {
  const { label, name, ...rest } = props;
  return (
    <>
      <FormControl fullWidth>
        <Field
          as={TextField}
          id={name}
          name={name}
          label={label}
          variant="standard"
          {...rest}
        />
      </FormControl>
    </>
  );
}

export default SearchFilter;

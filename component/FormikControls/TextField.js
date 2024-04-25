import { FormControl, TextField } from "@mui/material";
import { Field } from "formik";
import React from "react";

function InputField(props) {
  const { label, name, ...rest } = props;
  return (
    <>
      <FormControl fullWidth>
        <Field
          as={TextField}
          id={name}
          name={name}
          label={label}
          variant="outlined"
          {...rest}
        />
      </FormControl>
    </>
  );
}

export default InputField;

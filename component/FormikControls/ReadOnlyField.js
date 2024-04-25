import { FormControl, TextField } from "@mui/material";
import { Field } from "formik";
import React from "react";

function ReadOnlyField(props) {
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
          style={{ background: "#EAEAEA" }}
          InputProps={{
            readOnly: true,
          }}
          {...rest}
        />
      </FormControl>
    </>
  );
}

export default ReadOnlyField;

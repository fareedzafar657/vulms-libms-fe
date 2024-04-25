import React from "react";
import InputField from "./TextField";
import SelectField from "./SelectField";
import ReadOnlyField from "./ReadOnlyField";
import SelectWithObject from "./SelectWithObject";

function FieldsControls(props) {
  const { control, ...rest } = props;
  switch (control) {
    case "text":
      return <InputField {...rest} />;
    case "readOnly":
      return <ReadOnlyField {...rest} />;
    case "select":
      return <SelectField {...rest} />;
    case "userSelect":
      return <SelectWithObject {...rest} />;
    default:
      return null;
  }
}

export default FieldsControls;

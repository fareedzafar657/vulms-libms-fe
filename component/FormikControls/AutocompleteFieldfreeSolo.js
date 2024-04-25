import { FormControl } from "@mui/material";
import { Autocomplete, TextField } from "@mui/material";

const AutocompleteField = ({ field, form, label, options, ...other }) => {
  const { name, value } = field;
  const { setFieldValue } = form;

  return (
    <FormControl fullWidth>
      <Autocomplete
        multiple
        id={name}
        options={options}
        freeSolo
        onChange={(event, value) => setFieldValue(name, value)}
        value={value}
        renderInput={(params) => (
          <TextField
            {...params}
            {...other}
            variant="outlined"
            label={label}
            placeholder={label}
          />
        )}
      />
    </FormControl>
  );
};

export default AutocompleteField;

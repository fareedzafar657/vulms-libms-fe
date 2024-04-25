import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React from "react";

function RowsPerpageFilter(props) {
  const { setPagedata, filteringData, currentTake, searchParams, replace } =
    props;
  const hanleChange = async (values) => {
    const take = values.target.value;
    const filteredData = await filteringData(
      { take },
      searchParams,
      replace,
      setPagedata
    );
    setPagedata(filteredData);
  };
  return (
    <Formik
      initialValues={{
        take: 10,
      }}
    >
      <Form>
        <Stack width={200}>
          <FormControl>
            <InputLabel id="rowsPerPageLabel">Rows Per Page</InputLabel>
            <Field
              as={Select}
              labelId="rowsPerPageLabel"
              id="take"
              name="take"
              label="Rows Per Page"
              onChange={hanleChange}
              value={currentTake}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Field>
          </FormControl>
        </Stack>
      </Form>
    </Formik>
  );
}

export default RowsPerpageFilter;

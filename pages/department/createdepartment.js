import React from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  row,
  Stack,
} from "@mui/material";
import Layoutt from "../../component/lay/Layoutt";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import useAxiosAuth from "../../lib/hooks/useAxiosAuth";

const initialValues = {
  name: "",
};

function CreateDepartment() {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  const handleSubmit = async (values) => {
    try {
      const trimmedValues = {
        ...values,
        name: values.name.trim(),
      };

      const response = await axiosAuth.post(
        "/departments/create",
        trimmedValues
      );
      Swal.fire("Successful!", "deparment created succesfully!", "success");
      router.push("/department/list");
    } catch (error) {
      Swal.fire("Error creating department:", error.response.data.message);
      console.error("Error creating department:", error.response.data.message);
    }
  };

  return (
    <Layoutt>
      <div className="pt-20 mb-44">
        <div className="relative bg-white border border-gray-300  px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="text-sky-700 font-bold p-2 text-center text-3xl ">
            Add Department
          </div>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form>
              <Grid display={"block"} padding={1}>
                <Field
                  id="outlined-basic"
                  variant="outlined"
                  autoFocus
                  required
                  className="field"
                  as={TextField}
                  label="Name"
                  type="name"
                  name="name"
                  placeholder=""
                  fullWidth
                />
                <ErrorMessage name="name" />
              </Grid>

              <Stack
                direction={"row"}
                spacing={2}
                className="flex justify-end p-4 px-12"
              >
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => router.push("/department/list")}
                  className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                  // type="submit"
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
                  type="submit"
                >
                  Save
                </Button>
              </Stack>
            </Form>
          </Formik>
        </div>
      </div>
    </Layoutt>
  );
}

export default CreateDepartment;

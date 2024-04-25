import React from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import Layoutt from "../../component/lay/Layoutt";
import useAxiosAuth from "../../lib/hooks/useAxiosAuth";

const initialValues = {
  name: "",
};

function createlanguage() {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const handleSubmit = async (values) => {
    try {
      const trimmedValues = {
        ...values,
        name: values.name.trim(),
      };
      const response = await axiosAuth.post("/languages/create", trimmedValues);
      Swal.fire("Successful!", "languages created succesfully!", "success");
      router.push("/language/list");
    } catch (error) {
      Swal.fire("Error creating languages:", error.response.data.message);
      console.error("Error creating languages:", error);
      // router.reload();
    }
  };

  return (
    <Layoutt>
      <div className="mb-40">
        <div class="relative bg-white border border-gray-300  px-6 pt-10 pb-9 mt-20 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="text-sky-700 font-bold p-2 text-center text-3xl ">
            Add Language
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
                  className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                  onClick={() => router.push("/language/list")}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
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

export default createlanguage;

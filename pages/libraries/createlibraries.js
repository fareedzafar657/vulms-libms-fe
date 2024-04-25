import React from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import { useRouter } from "next/router";
import axios from "axios";
import { Container, Grid, Stack, TextField, Button } from "@mui/material";
import Layoutt from "../../component/lay/Layoutt";
import Swal from "sweetalert2";
import useAxiosAuth from "../../lib/hooks/useAxiosAuth";

const initialValues = {
  name: "",
  address: "",
};

function CreateLibraries() {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const handleSubmit = async (values) => {
    try {
      const trimmedValues = {
        ...values,
        name: values.name.trim(),
      };
      const response = await axiosAuth.post("/locations/create", trimmedValues);
      Swal.fire("Successful!", "libraries created succesfully!", "success");

      router.push("/libraries/list");
    } catch (error) {
      Swal.fire("Error creating libraries:", error.response.data.message);
      console.error("Error creating libraries:", error);
      // router.reload();
    }
  };

  return (
    <Layoutt>
      <div className=" mb-20">
        <div className="relative bg-white border border-gray-300  px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="text-sky-700 font-bold p-2 text-center text-3xl ">
            Add Library
          </div>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form>
              <Grid display={"block"} padding={1}>
                <Field
                  id="outlined-basic"
                  variant="outlined"
                  autoFocus
                  required
                  className="fields"
                  as={TextField}
                  label="Name"
                  type="name"
                  name="name"
                  placeholder=""
                  fullWidth
                />
                <ErrorMessage name="name" />
              </Grid>
              <Grid display={"block"} padding={1}>
                <Field
                  id="outlined-multiline-basic"
                  variant="outlined"
                  autoFocus
                  multiline
                  rows={4}
                  className="fields"
                  as={TextField}
                  label="Address"
                  name="address"
                  placeholder=""
                  fullWidth
                />
                <ErrorMessage name="address" />
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
                  onClick={() => router.push("/libraries/list")}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  type="submit"
                  className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
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

export default CreateLibraries;

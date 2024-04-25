import React from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import { useRouter } from "next/router";
import axios from "axios";
import { Container, Grid, Stack, TextField, Button } from "@mui/material";
import Layoutt from "../../component/lay/Layoutt";
import Swal from "sweetalert2";
import { getSession } from "next-auth/react";

const initialValues = {
  name: "",
};

function Createcurrency() {
  const router = useRouter();
  const handleSubmit = async (values) => {
    try {
      const trimmedValues = {
        ...values,
        name: values.name.trim(),
      };
      const session = await getSession();

      const response = await axios.post("/currencies/create", trimmedValues, {
        headers: {
          Authorization: `Bearer ${session?.user.access_token}`,
        },
      });
      Swal.fire("Successful!", "currencies created succesfully!", "success");

      router.push("/currencies/list");
    } catch (error) {
      Swal.fire("Error creating currencies:", error.response.data.message);
      console.error("Error creating currencies:", error);
    }
  };

  return (
    <Layoutt>
      <div className=" mb-40">
        <div className="relative bg-white border border-gray-300 mt-20 px-6 pt-10 pb-9  shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="text-sky-700 font-bold p-2 text-center text-3xl ">
            Add Currency
          </div>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            transform={(values) => ({
              ...values,
              name: values.name.trim(),
            })}
          >
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

              <Stack
                direction={"row"}
                spacing={2}
                className="flex justify-end p-4 px-12"
              >
                <Button
                  size="small"
                  variant="contained"
                  className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                  onClick={() => router.push("/currencies/list")}
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

export default Createcurrency;

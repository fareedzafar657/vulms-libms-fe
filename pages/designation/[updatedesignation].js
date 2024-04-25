import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Grid, TextField, Button, Typography, Stack } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import Layoutt from "../../component/lay/Layoutt";
import { getSession } from "next-auth/react";
import useAxiosAuth from "../../lib/hooks/useAxiosAuth";

export async function getServerSideProps(context) {
  const { params } = context;
  const session = await getSession(context);
  const response = await axios.get(
    `/designations/update/${params.updatedesignation}`,
    {
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
      },
    }
  );

  const { data } = response;
  return {
    props: {
      designationRecord: data,
    },
  };
}
function updatedesignation({ designationRecord }) {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const initialValues = {
    name: `${designationRecord.name}`,
  };

  const handleUpdate = async (values, designationId) => {
    const response = await axiosAuth
      .patch(`/designations/update/${designationId}`, values)
      .then((res) => {
        Swal.fire("Successful!", "designation Updated succesfully!", "success");
        router.push("/designation/list");
      })
      .catch((err) => {
        Swal.fire("Error updating designation:", err.message);
        console.error("Error updating designation:", err.message);
      });
  };

  return (
    <Layoutt>
      <div className="pt-20 mb-44">
        <div className="relative bg-white border border-gray-300  px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="text-sky-700 font-bold p-2 text-center text-3xl ">
            Update Designation
          </div>
          <Formik
            onSubmit={(value) => handleUpdate(value, designationRecord.id)}
            initialValues={initialValues}
          >
            <Form>
              <Grid display={"block"} padding={1}>
                <Field
                  autoFocus
                  required
                  className="field"
                  as={TextField}
                  label="Name"
                  type="name"
                  id="name"
                  name="name"
                  placeholder=""
                  variant="outlined"
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
                  onClick={() => router.push("/designation/list")}
                  className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:ring-slate-200 font-bold transition duration-300 ease-in-out transform hover:scale-110 rounded-lg text-sm px-5 py-2.5 text-center m-2"
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-200 transition duration-300 ease-in-out transform hover:scale-110 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
                  type="submit"
                >
                  Update
                </Button>
              </Stack>
            </Form>
          </Formik>
        </div>
      </div>
    </Layoutt>
  );
}

export default updatedesignation;

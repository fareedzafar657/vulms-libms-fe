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
  const session = await getSession(context);
  const { params } = context;
  const response = await axios.get(
    `/departments/update/${params.UpdateDepartments}`,
    {
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
      },
    }
  );

  const { data } = response;
  return {
    props: {
      departmentsRecord: data,
    },
  };
}
function UpdateDepartment({ departmentsRecord }) {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const initialValues = {
    name: `${departmentsRecord.name}`,
  };

  const handleUpdate = async (values, departmentsId) => {
    try {
      const trimmedValues = {
        ...values,
        name: values.name.trim(),
      };
      const res = await axiosAuth.patch(
        `/departments/update/${departmentsId}`,
        trimmedValues
      );
      Swal.fire("Successful!", "Department Updated successfully!", "success");
      router.push("/department/list");
    } catch (err) {
      Swal.fire("Error updating department:", err.message);
      console.error("Error updating department:", err.message);
    }
  };

  return (
    <Layoutt>
      <div className="pt-20 mb-44">
        <div className="relative bg-white border border-gray-300  px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="text-sky-700 font-bold p-2 text-center text-3xl ">
            Update Department
          </div>
          <Formik
            onSubmit={(value) => handleUpdate(value, departmentsRecord.id)}
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
                  placeholder="LRO-Office"
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
                  onClick={() => router.push("/department/list")}
                  className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
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

export default UpdateDepartment;

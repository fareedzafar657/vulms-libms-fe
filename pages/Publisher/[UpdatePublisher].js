import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Grid, TextField, Button, Stack } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import Layoutt from "../../component/lay/Layoutt";
import { getSession } from "next-auth/react";
import useAxiosAuth from "../../lib/hooks/useAxiosAuth";

export async function getServerSideProps(context) {
  const { params } = context;
  const session = await getSession(context);
  const response = await axios.get(
    `/publishers/update/${params.UpdatePublisher}`,
    {
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
      },
    }
  );
  const { data } = response;
  return {
    props: {
      publisherRecord: data,
    },
  };
}

function UpdatePublisher({ publisherRecord }) {
  const axiosAuth = useAxiosAuth();
  const router = useRouter();
  const initialValues = {
    name: `${publisherRecord.name}`,
  };

  const handleUpdate = async (values, publisherId) => {
    try {
      const trimmedValues = {
        ...values,
        name: values.name.trim(),
      };
      const updateResponse = await axiosAuth.patch(
        `/publishers/update/${publisherId}`,
        trimmedValues
      );
      Swal.fire("Successful!", "Publisher Updated successfully!", "success");
      router.push("/Publisher/list");
    } catch (err) {
      Swal.fire("Error updating publishers:", err.message);
      console.error("Error updating publishers:", err.message);
    }
  };
  return (
    <Layoutt>
      <div className="pt-20 mb-44">
        <div className="relative bg-white border border-gray-300  px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="text-sky-700 font-bold p-2 text-center text-3xl ">
            Update Publishers
          </div>
          <Formik
            onSubmit={(value) => handleUpdate(value, publisherRecord.id)}
            initialValues={initialValues}
          >
            <Form>
              <Grid display={"block"} padding={1}>
                <Field
                  id="outlined-basic"
                  variant="outlined"
                  required
                  className="fields"
                  as={TextField}
                  label="Name"
                  name="name"
                  fullWidth
                />
              </Grid>

              <Stack
                direction={"row"}
                spacing={2}
                className="flex justify-end p-4 px-12"
              >
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => router.push("/Publisher/list")}
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

export default UpdatePublisher;

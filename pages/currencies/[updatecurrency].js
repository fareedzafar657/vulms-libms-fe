import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Grid, TextField, Button, Stack } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import Layoutt from "../../component/lay/Layoutt";
import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const { params } = context;
  const session = await getSession(context);

  const response = await axios.get(
    `/currencies/update/${params.updatecurrency}`,
    {
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
      },
    }
  );
  const { data } = response;
  return {
    props: {
      currencyRecord: data,
    },
  };
}

function updatecurrencies({ currencyRecord }) {
  const router = useRouter();
  const initialValues = {
    name: `${currencyRecord.name}`,
  };

  const handleUpdate = async (values, currencyId) => {
    const trimmedValues = {
      ...values,
      name: values.name.trim(),
    };
    const session = await getSession();

    const response = await axios
      .patch(`/currencies/update/${currencyId}`, trimmedValues, {
        headers: {
          Authorization: `Bearer ${session?.user.access_token}`,
        },
      })
      .then((res) => {
        Swal.fire("Successful!", "currency Updated succesfully!", "success");
        router.push("/currencies/list");
      })
      .catch((err) => {
        Swal.fire("Error updating currencies:", err.message);
        console.error("Error updating currencies:", err.message);
      });
  };
  return (
    <Layoutt>
      <div className=" mb-20">
        <div class="relative bg-white border border-gray-300 mt-20 px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="text-sky-700 font-bold p-2 text-center text-3xl ">
            Update Currency
          </div>
          <Formik
            onSubmit={(value) => handleUpdate(value, currencyRecord.id)}
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
                  onClick={() => router.push("/currencies/list")}
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

export default updatecurrencies;

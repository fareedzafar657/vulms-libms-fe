import {
  Button,
  Grid,
  Stack,
  TextField,
  Container,
  Typography,
  Link,
} from "@mui/material";
import * as Yup from "yup";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import Swal from "sweetalert2";

const initialValues = {
  email: "",
};

function forgotpassward() {
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (values, { resetForm }) => {
    try {
      const response = await axios.post("/users/forgot-password", values);
      Swal.fire(
        "Successful!",
        "Reset password link has been sent to the email id",
        "success"
      );
      resetForm();
    } catch (error) {
      // setError("Email not found.");
      Swal.fire("Email not found.", error);
      console.error("Reset link sending failed", error);
    }
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address ")
      .matches(/^(\S+$)/g, "* This field cannot contain only blankspaces")
      .required(" "),
  });

  return (
    <main className=" min-h-screen flex box-border justify-center items-center">
      <div className="bg-[#a8e5f7]  flex items-stretch">
        <div className="md:block hidden  justify-center ml-1 mr-1 ">
          <img
            className=" w-[30vw] h-[80vh]"
            src="../../design.png"
            alt="login form image"
          />
        </div>
        <div className=" bg-white mt-0 mb-0 md:w-100 mx-auto px-10 py-10">
          <Container maxWidth="sm">
            {/* <div className="text-black font-bold p-2 text-center text-2xl ">
              Forgot Password
            </div> */}
            <Typography
              variant="h4"
              align="center"
              color="textPrimary"
              marginTop={"10px"}
            >
              Forgot Password
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="textPrimary"
              marginTop={"40px"}
              padding={"10px"}
            >
              Email Varification
              <hr />
            </Typography>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ errors, touched }) => (
                <Form>
                  <Stack spacing={2} direction={"row"} padding={"10px"}>
                    <Field
                      id="outlined-basic"
                      variant="standard"
                      as={TextField}
                      label="Email"
                      name="email"
                      type="email"
                      fullWidth
                      required
                      error={touched.email && !!errors.email}
                      helpertext={touched.email && errors.email}
                      placeholder="Email*"
                    />
                    <ErrorMessage
                      className="text-red-500"
                      name="email"
                      component="div"
                    />
                  </Stack>
                  <Stack spacing={2} direction={"row"} padding={"12px"}>
                    <Button
                      size="small"
                      variant="contained"
                      className=" bg-slate-500 text-black hover:text-white font-bold "
                      type="submit"
                      fullWidth
                    >
                      Send Email
                    </Button>
                  </Stack>
                  <Typography align="center" color="success">
                    {successMessage}
                  </Typography>
                  <Typography align="center" color="error">
                    {error}
                  </Typography>
                  <Link
                    className="flex font-bold pl-28"
                    href="/login"
                    underline="none"
                  >
                    Back to Login
                  </Link>
                </Form>
              )}
            </Formik>
          </Container>
        </div>
      </div>
    </main>
  );
}

export default forgotpassward;

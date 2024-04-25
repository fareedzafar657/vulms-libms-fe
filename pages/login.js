import { useState, useContext, use } from "react";
import { signIn } from "next-auth/react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import {
  Button,
  TextField,
  Container,
  Typography,
  Grid,
  Link,
} from "@mui/material";
import * as Yup from "yup";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import FromLoader from "../component/FromLoader";
import Swal from "sweetalert2";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const onSubmit = async (values) => {
    setloading(true);
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        // callbackUrl: "/master",
      });
      if (res.ok) return router.push("/");
      if (res.error) {
        Swal.fire({
          icon: "error",
          title: `${res.error}`,
        });
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");

      console.error("Login failed", err);
    }
    setloading(false);
  };

  return (
    <main className=" min-h-screen flex box-border justify-center items-center">
      {loading && <FromLoader />}

      <div className="bg-[#a8e5f7]  flex items-stretch">
        <div className="md:block hidden  justify-center ml-1 mr-1 ">
          <img
            className=" w-[30vw] h-[80vh]"
            src="../../design.png"
            alt="login form image"
          />
        </div>
        <div className=" bg-white mt-0 mb-0 md:w-100 mx-auto px-10 py-10">
          <div className="w-18 m-0">
            <img className=" " src="../../logo.png" alt="login form image" />
          </div>
          <Container maxWidth="md">
            <Typography
              variant="h4"
              align="center"
              color="textPrimary"
              marginTop={"10px"}
            >
              Login
            </Typography>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              <Form id="my-form">
                <Grid
                  display={"block"}
                  columnSpacing={2}
                  flex-direction={"row"}
                >
                  <Field
                    as={TextField}
                    label="Email"
                    variant="standard"
                    type="text"
                    id="email"
                    name="email"
                    placeholder="abc@vu.edu.pk"
                    fullWidth
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    render={(msg) => (
                      <span className="text-red-500">{msg}</span>
                    )}
                  />
                </Grid>

                <Grid
                  display={"block"}
                  columnSpacing={2}
                  rowSpacing={5}
                  flex-direction={"row"}
                >
                  <Field
                    as={TextField}
                    label="Password"
                    helpertext="Do not share your password with anyone!"
                    variant="standard"
                    type="password"
                    id="password"
                    name="password"
                    className="text-sm"
                    fullWidth
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    render={(msg) => (
                      <span className="text-red-500">{msg}</span>
                    )}
                  />
                  {/* {error && <div className="text-red-800 ">{error}</div>} */}
                </Grid>

                <Grid
                  display={"block"}
                  columnSpacing={2}
                  flex-direction={"row"}
                >
                  <Button
                    size="small"
                    variant="contained"
                    type="submit"
                    fullWidth
                    className=" bg-slate-500 text-black hover:text-white"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Login
                  </Button>

                  <Link
                    className="flex justify-end font-bold"
                    href="/auth/forgotpassward"
                    underline="none"
                  >
                    Forgot Password?
                  </Link>
                </Grid>
              </Form>
            </Formik>
          </Container>
        </div>
      </div>
    </main>
  );
};

export default Login;

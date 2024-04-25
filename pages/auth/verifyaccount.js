import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import {
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  Stack,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import React from "react";
import * as Yup from "yup";

import { getSession } from "next-auth/react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const initialValues = {
  password: "",
  confirm_password: "",
};

function VerifyAccount() {
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const { query } = router;

  const resetToken = query.resetToken;

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    if (resetToken) {
      try {
        const session = await getSession();
        const response = await axios.patch(
          `/auth/verifyaccount/${resetToken}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${session?.user.access_token}`,
            },
          }
        );
        // setSuccessMessage("Verification Successful, Redirecting to login page");
        Swal.fire("Successful!", "Verification Successful", "success");
        router.push("/login");
      } catch (error) {
        setError("Reset token not found");
        console.error("Account verification failed", error);
      }
    }
  };

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
            <div className="text-black font-bold p-2 text-center text-2xl ">
              Set Password
            </div>
            {/* <Typography
              variant="h6"
              align="center"
              color="textPrimary"
              marginTop={"30px"}
            >
              Verify Account
              <hr />
            </Typography> */}
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              <Form>
                <Stack spacing={2} direction={"row"} padding={"10px"}>
                  <Field
                    as={TextField}
                    label="New Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    variant="standard"
                    fullWidth
                    required
                    placeholder="Enter your new password here"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <ErrorMessage name="password" component="div" />
                </Stack>
                <Stack spacing={2} direction={"row"} padding={"10px"}>
                  <Field
                    as={TextField}
                    label="Confirm Password"
                    name="confirm_password"
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    variant="standard"
                    fullWidth
                    required
                    placeholder="Please enter your password again"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <ErrorMessage name="password" component="div" />
                </Stack>
                <Stack spacing={2} direction={"row"} padding={"20px"}>
                  <Button
                    size="small"
                    variant="contained"
                    className=" bg-slate-500 text-black hover:text-white font-bold "
                    type="submit"
                    fullWidth
                  >
                    Save Password
                  </Button>
                </Stack>
                <Typography align="center" style={{ color: "green" }}>
                  {successMessage}
                </Typography>
                <Typography align="center" style={{ color: "red" }}>
                  {error}
                </Typography>
              </Form>
            </Formik>
          </Container>
        </div>
      </div>
    </main>
  );
}

export default VerifyAccount;

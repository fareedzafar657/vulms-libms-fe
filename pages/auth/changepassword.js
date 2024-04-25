import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Field, Formik, Form, ErrorMessage } from "formik";
import { Stack, IconButton, Button, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";

const initialValues = {
  old_password: "",
  new_password: "",
};

function ChangePassword() {
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (values.confirm_password !== values.new_password) {
        throw "Confirm Password is Incorrect!";
      }
      const session = await getSession();

      const response = await axios.patch(`/auth/change-password`, values, {
        headers: {
          Authorization: `Bearer ${session?.user.access_token}`,
        },
      });
      Swal.fire("Successful!", "Change Password Successfully", "success");
      router.push("/");
    } catch (error) {
      setError("Failed");
      console.error("Change Password failed", error);
      Swal.fire("Oops!", `${error?.response?.data?.message || error}`, "error");
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white  rounded-xl shadow shadow-slate-400">
      <div className="flex justify-center items-center h-screen">
        <div className="w-80">
          <h2 className="text-2xl font-semibold pb-8 text-sky-700 flex justify-center mb-4">
            Change Password
          </h2>

          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form>
              <div className="mb-4">
                <Field
                  as={TextField}
                  id="old_password"
                  variant="outlined"
                  label="Old Password"
                  name="old_password"
                  type={showCurrentPassword ? "text" : "password"}
                  fullWidth
                  placeholder="Enter your old password here"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <ErrorMessage name="current_password" component="div" />
              </div>
              <div className="mb-4">
                <Field
                  id="new_password"
                  variant="outlined"
                  as={TextField}
                  label="New Password"
                  name="new_password"
                  type={showNewPassword ? "text" : "password"}
                  fullWidth
                  placeholder="Enter your new password here"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <ErrorMessage
                  name="new_password"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-4">
                <Field
                  as={TextField}
                  id="confirm_password"
                  variant="outlined"
                  label="Confirm New Password"
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
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
                <ErrorMessage
                  name="confirm_password"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <Stack
                direction={"row"}
                spacing={2}
                className="flex justify-end mb-8"
              >
                <Button
                  size="small"
                  variant="contained"
                  className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  type="submit"
                  className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
                >
                  Confirm
                </Button>
              </Stack>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;

import React from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Layoutt from "../../component/lay/Layoutt";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import FieldsControls from "../../component/FormikControls/FieldsControls";
import {
  InputLabel,
  Select,
  TextField,
  Stack,
  Button,
  MenuItem,
  ListItemText,
  Checkbox,
  OutlinedInput,
  Container,
  Typography,
  Grid,
  Link,
  errors,
  FormControl,
} from "@mui/material";
import { getSession } from "next-auth/react";
import useAxiosAuth from "../../lib/hooks/useAxiosAuth";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const response = await axios.get("/users/create", {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });
  const { data } = response;
  return {
    props: {
      departments: data.departments,
      designations: data.designations,
      roles: data.roles,
    },
  };
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("required")
    .max(30, "Name must be at most 30 characters"),
  email: Yup.string()
    .required("required")
    .email("Invalid email address")
    .max(30, "Email must be at most 30 characters")
    .matches(
      /^[a-zA-Z0-9._%+-]+@vu\.edu\.pk$/,
      "Email domain must be @vu.edu.pk"
    ),
  employee_id: Yup.string()
    .required(" required")
    .max(5, "Employee ID must be at most 5 characters"),
  phone: Yup.string()
    .required(" required")
    .max(20, "Phone number must be at most 20 characters"),
  tel_ext: Yup.string().max(
    5,
    "Telephone extension must be at most 5 characters"
  ),
  departmentId: Yup.string().required(" required"),
  designationId: Yup.string().required(" required"),
});

const initialValues = {
  name: "",
  email: "",
  employee_id: "",
  phone: "",
  tel_ext: "",
  roleIds: [],
  departmentId: "",
  designationId: "",
  username: "",
};

function registrationForm({ departments, designations, roles }) {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axiosAuth.post("/users/create", values);
      Swal.fire("Successful!", "Registration created successfully!", "success");
      router.push("/users/list");
    } catch (error) {
      Swal.fire("Error!", `${error.response.data.message}`, "error");
      console.error("Registration failed:", error.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Layoutt>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          // values,
          setFieldValue,
          // errors,
          // touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <div className="bg-white border-4 rounded-lg shadow relative">
            <div className="flex justify-center p-5   rounded-t">
              <h2 className="text-2xl font-bold text-center text-sky-700  mb-2">
                User Registration
              </h2>
            </div>
            <Form className="p-6 space-y-6">
              <div className="border-b border-gray-900/10 pb-4">
                <h3 className="text-xl font-bold leading-7 pt-4 px-2 text-gray-900">
                  User Details
                </h3>
              </div>

              <Stack direction={"row"} spacing={2}>
                <FormControl fullWidth>
                  <Field
                    as={TextField}
                    id="email"
                    name="email"
                    label="Email"
                    variant="outlined"
                    required
                    className="border-2 border-gray-400 p-0 w-full rounded-lg focus:outline-none focus:border-blue-400"
                  ></Field>
                </FormControl>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500"
                />
                <FormControl fullWidth>
                  <Field type="ReadOnly">
                    {({ field, form }) => {
                      return (
                        <Field
                          as={TextField}
                          type="ReadOnly"
                          id="username"
                          name="username"
                          label="Username"
                          variant="outlined"
                          style={{ background: "#EAEAEA" }}
                          value={form.values.email.split("@")[0]}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      );
                    }}
                  </Field>
                </FormControl>
              </Stack>

              <Stack direction={"row"} spacing={2}>
                <Field
                  as={TextField}
                  name="name"
                  label="Name"
                  variant="outlined"
                  required
                  id="outlined-basic"
                  className="border-2 border-gray-400 p-0 w-full rounded-lg focus:outline-none focus:border-blue-400"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500"
                />
                <Field
                  as={TextField}
                  name="employee_id"
                  label="Employee ID"
                  variant="outlined"
                  required
                  className="border-2 border-gray-400 p-0 w-full rounded-lg focus:outline-none focus:border-blue-400"
                />
                <ErrorMessage
                  name="employee_id"
                  component="div"
                  className="text-red-500"
                />
              </Stack>

              <Stack direction={"row"} spacing={2}>
                <Field type="text" id="phone" name="phone">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Phone No."
                      variant="outlined"
                      id="outlined-basic"
                      className="border-2 border-gray-400 p-0 w-full rounded-lg focus:outline-none focus:border-blue-400"
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500"
                />

                <Field
                  as={TextField}
                  name="tel_ext"
                  label="Telephone Extension"
                  variant="outlined"
                  className="border-2 border-gray-400 p-0 w-full rounded-lg focus:outline-none focus:border-blue-400"
                />
                <ErrorMessage
                  name="tel_ext"
                  component="div"
                  className="text-red-500"
                />
              </Stack>
              <Stack direction={"row"} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="designation">Designation</InputLabel>
                  <Field
                    as={Select}
                    id="designation"
                    name="designationId"
                    label="Designation"
                    required
                    className=" border-gray-400 p-0 w-full rounded-lg focus:outline-none focus:border-blue-400"
                  >
                    <MenuItem value={null}>None</MenuItem>
                    {designations
                      .slice()
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((designation) => (
                        <MenuItem key={designation.id} value={designation.id}>
                          {designation.name}
                        </MenuItem>
                      ))}
                  </Field>{" "}
                  <ErrorMessage
                    name="designationId"
                    component="div"
                    className="text-red-500"
                  />
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="department">Department</InputLabel>
                  <Field
                    as={Select}
                    id="department"
                    name="departmentId"
                    required
                    label="Department"
                    className=" border-gray-400 p-0 w-full rounded-lg focus:outline-none focus:border-blue-400"
                  >
                    {departments
                      .slice()
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((department) => (
                        <MenuItem key={department.id} value={department.id}>
                          {department.name}
                        </MenuItem>
                      ))}
                  </Field>{" "}
                  <ErrorMessage
                    name="departmentId"
                    component="div"
                    className="text-red-500"
                  />
                </FormControl>
              </Stack>

              <Stack sx={{ width: "49.2%" }}>
                <FormControl fullWidth>
                  <InputLabel id="role">Roles</InputLabel>
                  <Field name="roleIds" id="role" label="Roles" required>
                    {({ form }) => (
                      <Select
                        multiple
                        // className={`border-gray-400 p-0 w-full rounded-lg focus:outline-none ${
                        //   form.touched.roleIds && form.errors.roleIds
                        //     ? "border-red-500" // Apply red border when there is an error
                        //     : "focus:border-blue-400" // Apply blue border when focused
                        // }`}
                        value={form.values.roleIds}
                        input={<OutlinedInput label="Roles" />}
                        onChange={(e) =>
                          form.setFieldValue("roleIds", e.target.value)
                        }
                        renderValue={(selectedRoles) => {
                          const selected = [];
                          for (let role of roles) {
                            for (let selectedRole of selectedRoles) {
                              if (role.id === selectedRole) {
                                selected.push(role.name);
                              }
                            }
                          }
                          return selected.join(", ");
                        }}
                      >
                        {roles
                          .slice()
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                              <Checkbox
                                checked={
                                  form.values.roleIds.indexOf(role.id) > -1
                                }
                              />
                              <ListItemText primary={role.name} />
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  </Field>
                </FormControl>
              </Stack>

              <Stack direction={"row"} spacing={2} justifyContent="flex-end">
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => router.push("/users/list")}
                  className="text-white bg-slate-600 hover:bg-slate-700 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-4 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  className="text-white  bg-sky-700 hover:bg-sky-800 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-4 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
                  type="submit"
                >
                  Submit
                </Button>
              </Stack>
            </Form>
          </div>
        )}
      </Formik>
    </Layoutt>
  );
}

export default registrationForm;

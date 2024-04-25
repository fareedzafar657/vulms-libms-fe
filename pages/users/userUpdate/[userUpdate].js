import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/router";
import Layoutt from "../../../component/lay/Layoutt";
import FieldsControls from "../../../component/FormikControls/FieldsControls";
import {
  Stack,
  TextField,
  Button,
  Select,
  InputLabel,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormControl,
} from "@mui/material";
import Swal from "sweetalert2";
import { getSession } from "next-auth/react";
import useAxiosAuth from "../../../lib/hooks/useAxiosAuth";

export async function getServerSideProps(context) {
  const { params } = context;
  const session = await getSession(context);
  const response = await axios.get(`/users/update/${params.userUpdate}`, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });
  const { data } = response;
  return {
    props: {
      user: data.userRecord,
      departments: data.departments,
      designations: data.designations,
      roles: data.roles,
    },
  };
}

function userUpdate({ user, departments, designations, roles }) {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  const onSubmit = async (values, userId) => {
    try {
      const response = await axiosAuth.patch(`/users/update/${userId}`, values);
      Swal.fire("Successful!", "You updated the User!", "success");
      // router.reload();
      router.push("/users/list");
    } catch (error) {
      console.error("Update failed:", error.message);
    }
  };
  return (
    <Layoutt>
      <Formik
        initialValues={{
          name: `${user.name}`,
          email: `${user.email}`,
          employee_id: `${user.employee_id}`,
          username: `${user.username}`,
          phone: `${user.phone}`,
          tel_ext: `${user.tel_ext}`,
          roleIds: user.roles.map((role) => {
            return role.id;
          }),
          departmentId: `${user.department.id}`,
          designationId: `${user.designation.id}`,
        }}
        // validationSchema={validationSchema}
        onSubmit={(values) => onSubmit(values, user.id)}
      >
        {({ values, errors, touched }) => (
          <div className="bg-white border-4 rounded-lg shadow relative ">
            <div className="flex justify-center p-5   rounded-t">
              <h3 className="text-2xl font-bold text-center text-sky-700  mb-2">
                Update User
              </h3>
            </div>
            <Form className="p-6 space-y-6">
              <div className="border-b border-gray-900/10 pb-4">
                <h3 className="text-xl font-bold leading-7 pt-4 px-2 text-gray-900">
                  User Details
                </h3>
              </div>
              <Stack direction={"row"} spacing={2}>
                {/* <Field
                      as={TextField}
                      name="name"
                      label="Name"
                      variant="outlined"
                      error={touched.name && !!errors.name}
                      className="border-2 border-gray-400 p-0 w-full rounded-lg focus:outline-none focus:border-blue-400"
                    /> */}
                <Field type="email" id="email" name="email">
                  {({ field }) => (
                    <FieldsControls
                      {...field}
                      control="readOnly"
                      label="Email"
                      InputProps={{ readOnly: true }}
                      id="outlined-basic"
                      variant="outlined"
                      required
                      className="border-2 border-gray-400 p-0 w-full rounded-lg focus:outline-none focus:border-blue-400"
                    />
                  )}
                </Field>

                <Field type="text" id="username" name="username">
                  {({ field }) => (
                    <FieldsControls
                      control="readOnly"
                      {...field}
                      label="Username"
                      id="outlined-basic"
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      required
                      className="border-2 border-gray-400 p-0 w-full rounded-lg focus:outline-none focus:border-blue-400"
                    />
                  )}
                </Field>
              </Stack>
              <Stack spacing={2} direction={"row"}>
                <Field
                  as={TextField}
                  name="name"
                  label="Name"
                  variant="outlined"
                  required
                  error={touched.name && !!errors.name}
                  className="border-2 border-gray-400 p-0 w-full rounded-lg focus:outline-none focus:border-blue-400"
                />
                <Field
                  as={TextField}
                  name="employee_id"
                  label="Employee ID"
                  variant="outlined"
                  required
                  className="border-2 border-gray-400 p-0 w-full rounded-lg focus:outline-none focus:border-blue-400"
                />
              </Stack>
              {/* <label htmlFor="phone">Phone No.</label> */}
              <Stack spacing={2} direction={"row"}>
                <Field type="text" id="phone" name="phone">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Phone No."
                      variant="outlined"
                      className="border-2 border-gray-400 p-0 w-full rounded-lg focus:outline-none focus:border-blue-400"
                    />
                  )}
                </Field>
                <Field
                  as={TextField}
                  name="tel_ext"
                  label="Telephone Extension"
                  variant="outlined"
                  className="border-2 border-gray-400 p-0 w-full rounded-lg focus:outline-none focus:border-blue-400"
                />
              </Stack>
              <Stack spacing={2} direction={"row"}>
                <FormControl fullWidth>
                  <InputLabel id="departmentLabel">Department</InputLabel>
                  <Field
                    as={Select}
                    id="department"
                    name="departmentId"
                    label="Department"
                    required
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
                  </Field>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="designationLabel">Designation</InputLabel>
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
                  </Field>
                </FormControl>
              </Stack>
              <Stack width="49.4%">
                <FormControl fullWidth>
                  <InputLabel id="roleLabel">Roles</InputLabel>
                  <Field name="roleIds">
                    {({ form }) => (
                      <Select
                        id="roleIds"
                        multiple
                        required
                        className=" border-gray-400 p-0 w-full rounded-lg focus:outline-none focus:border-blue-400"
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
                  className="text-white bg-slate-600 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-slate-700 focus:ring-4 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                  onClick={() => router.push(`/users/list`)}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  className="text-white  bg-sky-700 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-sky-800 focus:ring-4 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
                  type="submit"
                >
                  Update
                </Button>
              </Stack>
            </Form>
          </div>
        )}
      </Formik>
    </Layoutt>
  );
}

export default userUpdate;

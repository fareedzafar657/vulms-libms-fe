import FromLoader from "../../../component/FromLoader";
import React, { useState } from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import Swal from "sweetalert2";
import FieldsControls from "../../../component/FormikControls/FieldsControls";
import { Button } from "@mui/base";
import { useRouter } from "next/router";
import Layoutt from "../../../component/lay/Layoutt";
import { Stack } from "@mui/material";
import { getSession } from "next-auth/react";
import useAxiosAuth from "../../../lib/hooks/useAxiosAuth";

export async function getServerSideProps(context) {
  const { params } = context;
  const session = await getSession(context);
  const response = await axios.get(`/assets/issuance/${params.issuance_id}`, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });
  const { data } = response;
  return {
    props: {
      asset_id: params.issuance_id,
      isssuing_asset: data.isssuing_asset,
      users_list: data.usersList,
    },
  };
}

function issuance({ isssuing_asset, users_list, asset_id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [borrower, setBorrower] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [tel_ext, setTel_ext] = useState("");
  const axiosAuth = useAxiosAuth();
  const selectedUser = (event) => {
    setBorrower(event.target.value);
    setDepartment(event.target.value.department.name);
    setEmail(event.target.value.email);
    setTel_ext(event.target.value.tel_ext);
  };

  const initialValues = {
    assetId: `${asset_id}`,
    borrowerId: `${borrower.id}`,
  };

  const due_date = new Date();
  due_date.setMonth(due_date.getMonth() + 1);
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axiosAuth.post("/assets/issuance", values);
      Swal.fire("Successful!", "You issued a Magazine!", "success");

      router.push(`/magazines/detail/${asset_id}`);
    } catch (error) {
      Swal.fire(
        "you failed to issued a Magazine!",
        error.response.data.data,
        "error"
      );
      console.error("Failed:", error.response.data.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layoutt>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        <div className="bg-white border-4 rounded-lg shadow relative m-10">
          <div className="flex justify-center p-5  border-b rounded-t">
            <h3 className="text-3xl  text-sky-700 font-bold">
              Magazine Issuance
            </h3>
          </div>
          {loading && <FromLoader />}
          <Form className="p-6 space-y-6">
            <div className="border-b border-gray-900/10 pb-4">
              <h3 className="text-xl font-bold leading-7 pt-4 px-2 text-gray-900">
                Magazine Details
              </h3>
            </div>
            <Stack spacing={2} direction={"row"}>
              <FieldsControls
                control="readOnly"
                name="title"
                label="Title"
                defaultValue={isssuing_asset.title}
              />
              <FieldsControls
                control="readOnly"
                name="volume_no"
                label="Volume No."
                defaultValue={isssuing_asset.volume_no}
              />
            </Stack>
            <div className="border-b border-gray-900/10 pb-4">
              <h3 className="text-xl font-bold leading-7 pt-4 px-2 text-gray-900">
                User Details
              </h3>
            </div>
            <Stack spacing={2} direction={"row"}>
              <FieldsControls
                control="userSelect"
                name="borrowerId"
                label="Borrower*"
                labelId="borrowerLabel"
                options={users_list}
                onChange={selectedUser}
                value={borrower}
                required
              />
              <FieldsControls
                control="readOnly"
                name="userDepartment"
                label="User's Department"
                value={department}
              />
            </Stack>
            <Stack spacing={2} direction={"row"}>
              <FieldsControls
                control="readOnly"
                name="userEmail"
                label="User's Email"
                value={email}
              />
              <FieldsControls
                control="readOnly"
                name="userTel_ext"
                label="User's Telephone Extention"
                value={tel_ext}
              />
            </Stack>
            <div className="border-b border-gray-900/10 pb-4">
              <h3 className="text-xl font-bold leading-7 pt-4 px-2 text-gray-900">
                Issuance Details
              </h3>
            </div>
            <Stack spacing={2} direction={"row"} sx={{ width: "49.2%" }}>
              <FieldsControls
                control="readOnly"
                name="dueDate"
                label="Due Date"
                defaultValue={due_date.toISOString().split("T")[0]}
              />
            </Stack>
            <Stack spacing={2} direction={"row"} className="flex justify-end">
              <Button
                size="small"
                variant="contained"
                className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                onClick={() => router.push(`/magazines/detail/${asset_id}`)}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                type="submit"
                className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
              >
                Issue
              </Button>
            </Stack>
          </Form>
        </div>
      </Formik>
    </Layoutt>
  );
}

export default issuance;

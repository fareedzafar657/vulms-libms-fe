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
  const response = await axios.get(`/assets/reissuance/${params.reIssuance}`, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });
  const { data } = response;

  return {
    props: {
      issued_id: params.reIssuance,
      issued_record: data,
      borrower: data.borrower,
      issued_asset: data.issued_asset,
      issued_by: data.issued_by,
    },
  };
}

function issuance({
  borrower,
  issued_asset,
  issued_by,
  issued_record,
  issued_id,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const axiosAuth = useAxiosAuth();

  const re_due_date = new Date(
    issued_record.re_due_date
      ? issued_record.re_due_date
      : issued_record.due_date
  );
  re_due_date.setDate(re_due_date.getDate() + 15);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axiosAuth.post(`/assets/reissuance/${issued_id}`);
      Swal.fire("Successful!", "You re-issued a Magazine!", "success");

      router.push(`/magazines/detail/${issued_id}`);
    } catch (error) {
      Swal.fire(
        "you failed to re-issued a Magazine!",
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
      <Formik>
        <div className="bg-white border-4 rounded-lg shadow relative m-10">
          {loading && <FromLoader />}
          <div className="flex justify-center p-5  border-b rounded-t">
            <h3 className="text-3xl  text-sky-700 font-bold">
              Magazine Re-Issuance
            </h3>
          </div>

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
                defaultValue={issued_asset?.title}
              />
              <FieldsControls
                control="readOnly"
                name="volume_no"
                label="Volume No."
                defaultValue={issued_asset?.volume_no}
              />
            </Stack>
            <div className="border-b border-gray-900/10 pb-4">
              <h3 className="text-xl font-bold leading-7 pt-4 px-2 text-gray-900">
                User Details
              </h3>
            </div>
            <Stack spacing={2} direction={"row"}>
              <FieldsControls
                control="readOnly"
                name="name"
                label="User's Name"
                defaultValue={borrower?.name}
              />
              <FieldsControls
                control="readOnly"
                name="userDepartment"
                label="User's Department"
                value={borrower?.department?.name}
              />
            </Stack>
            <Stack spacing={2} direction={"row"}>
              <FieldsControls
                control="readOnly"
                name="userEmail"
                label="User's Email"
                value={borrower?.email}
              />
              <FieldsControls
                control="readOnly"
                name="userTel_ext"
                label="User's Telephone Extention"
                value={borrower?.tel_ext}
              />
            </Stack>
            <div className="border-b border-gray-900/10 pb-4">
              <h3 className="text-xl font-bold leading-7 pt-4 px-2 text-gray-900">
                Issuance Details
              </h3>
            </div>
            <Stack spacing={2} direction={"row"}>
              <FieldsControls
                control="readOnly"
                name="dueDate"
                label="Due Date"
                defaultValue={
                  issued_record?.re_due_date
                    ? issued_record?.re_due_date
                    : issued_record?.due_date
                }
              />
              <FieldsControls
                control="readOnly"
                name="issuedBy"
                label="Issued By"
                defaultValue={issued_by?.name}
              />
            </Stack>
            <div className="border-b border-gray-900/10 pb-4">
              <h3 className="text-xl font-bold leading-7 pt-4 px-2 text-gray-900">
                Re-Issuance Details
              </h3>
            </div>
            <Stack spacing={2} direction={"row"} sx={{ width: "49.2%" }}>
              <FieldsControls
                control="readOnly"
                name="reDueDate"
                label="Re-issuance Due Date"
                defaultValue={re_due_date.toISOString().split("T")[0]}
              />
            </Stack>
            <Stack spacing={2} direction={"row"} className="flex justify-end">
              <Button
                size="small"
                variant="contained"
                className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                onClick={() => router.push(`/magazines/detail/${issued_id}`)}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                type="button"
                onClick={handleSubmit}
                className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-25"
              >
                Re-Issue
              </Button>
            </Stack>
          </Form>
        </div>
      </Formik>
    </Layoutt>
  );
}

export default issuance;

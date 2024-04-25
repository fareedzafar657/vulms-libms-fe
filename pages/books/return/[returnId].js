import React, { useState } from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import Swal from "sweetalert2";
import FieldsControls from "../../../component/FormikControls/FieldsControls";
import { Button } from "@mui/base";
import { useRouter } from "next/router";
import * as Yup from "yup";
import Layoutt from "../../../component/lay/Layoutt";
import { Stack } from "@mui/material";
import FormLoader from "../../../component/FromLoader";
import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const { params } = context;
  const session = await getSession(context);
  const response = await axios.get(`/assets/return/${params.returnId}`, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });
  const { data } = response;
  return {
    props: {
      asset_id: params.returnId,
      issued_record: data,
      borrower: data.borrower,
      issued_asset: data.issued_asset,
      issued_by: data.issued_by,
      re_issued_by: data.re_issued_by,
    },
  };
}

function issuance({
  issued_asset,
  issued_record,
  asset_id,
  borrower,
  issued_by,
  re_issued_by,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const currDate = new Date();
  const initialValues = {
    remarks_on_return_condition: "",
    fine_amount: "",
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const session = await getSession();

      const response = await axios.patch(`/assets/return/${asset_id}`, values, {
        headers: {
          Authorization: `Bearer ${session?.user.access_token}`,
        },
      });
      Swal.fire("Successful!", "You returned a Book!", "success");
      router.push(`/books/detail/${asset_id}`);
    } catch (error) {
      Swal.fire(
        "you failed to return a book!",
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
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <div className="bg-white border-4 rounded-lg shadow relative m-10">
          {loading && <FormLoader />}
          <div className="flex justify-center p-5  border-b rounded-t">
            <h3 className="text-3xl  text-sky-700 font-bold">Book Return</h3>
          </div>
          <Form className="p-6 space-y-6">
            <div className="border-b border-gray-900/10 pb-4">
              <h3 className="text-xl font-bold leading-7 pt-4 px-2 text-gray-900">
                Book Details
              </h3>
            </div>
            <Stack spacing={2} direction={"row"}>
              <FieldsControls
                control="readOnly"
                name="acc_no"
                label="Acc No."
                defaultValue={issued_asset.acc_no}
              />
              <FieldsControls
                control="readOnly"
                name="title"
                label="Title"
                defaultValue={issued_asset.title}
              />
            </Stack>
            <Stack spacing={2} direction={"row"} sx={{ width: "49.2%" }}>
              <FieldsControls
                control="readOnly"
                name="author"
                label="Author"
                defaultValue={issued_asset.author}
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
                name="userName"
                label="User's Name"
                value={borrower?.name}
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
                value={issued_record?.due_date}
              />
              <FieldsControls
                control="readOnly"
                name="issuedBy"
                label="Issued By"
                value={issued_by?.name}
              />
            </Stack>
            <div className="border-b border-gray-900/10 pb-4">
              <h3 className="text-xl font-bold leading-7 pt-4 px-2 text-gray-900">
                Re-Issuance Details
              </h3>
            </div>
            <Stack spacing={2} direction={"row"}>
              <FieldsControls
                control="readOnly"
                name="reDueDate"
                label="Re-Issued Due Date"
                value={issued_record?.re_due_date}
              />
              <FieldsControls
                control="readOnly"
                name="reIssuedBy"
                label="Re-Issued By"
                value={re_issued_by ? re_issued_by?.name : null}
              />
            </Stack>
            <div className="border-b border-gray-900/10 pb-4">
              <h3 className="text-xl font-bold leading-7 pt-4 px-2 text-gray-900">
                Return Details
              </h3>
            </div>
            <Stack spacing={2} direction={"row"}>
              <FieldsControls
                control="readOnly"
                name="returnDate"
                label="Return Date"
                value={currDate.toISOString().split("T")[0]}
              />
              <FieldsControls
                control="text"
                name="fine_amount"
                label="Fine Amount"
              />
            </Stack>
            <Stack spacing={2} direction={"row"}>
              <FieldsControls
                control="text"
                name="remarks_on_return_condition"
                label="Remarks on Return Condition"
                multiline
                rows={4}
              />
            </Stack>
            <Stack spacing={2} direction={"row"} className="flex justify-end">
              <Button
                size="small"
                variant="contained"
                className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                onClick={() => router.push(`/books/detail/${asset_id}`)}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                type="submit"
                className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
              >
                Return
              </Button>
            </Stack>
          </Form>
        </div>
      </Formik>
    </Layoutt>
  );
}

export default issuance;

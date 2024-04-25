import Quagga from "@ericblade/quagga2";
import { useEffect, useState } from "react";
import { Button, FormControl } from "@mui/base";
import { Stack, TextField } from "@mui/material";
import Barcode from "react-barcode";
import axios from "axios";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Layoutt from "../../component/lay/Layoutt";
import { Form, Formik } from "formik";
import FieldsControls from "../../component/FormikControls/FieldsControls";
import { getSession } from "next-auth/react";

function scan() {
  const router = useRouter();

  const [barcode, setBarcode] = useState("");
  const [id, setId] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [borrower, setBorrower] = useState("");
  const [department, setDepartment] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reDueDate, setReDueDate] = useState("");

  const initQuagga = async () => {
    try {
      if (Quagga) {
        Quagga.stop();
      }
    } catch (error) {
      console.error("Error stopping Quagga:", error);
    }

    try {
      await Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.getElementById("barcode-scan-result"),
            constraints: {
              width: 640,
              height: 480,
              facingMode: "environment", // or user for the front camera
            },
          },
          decoder: {
            readers: ["code_128_reader", "ean_reader"],
          },
        },
        (err) => {
          if (err) {
            console.error("Error initializing Quagga:", err);
            return;
          }

          Quagga.start();

          Quagga.onDetected((result) => {
            const scannedBarcode = result.codeResult.code;
            setBarcode(scannedBarcode);

            Quagga.stop();
          });
        }
      );
    } catch (error) {
      console.error("Error initializing Quagga:", error);
    }
  };

  const assetRecord = async () => {
    if (barcode) {
      const session = await getSession();
      await axios
        .get(`/assets/searchByBarcode/${barcode}`, {
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
          },
        })
        .then((res) => {
          setId(res.data.record.id);
          setCategory(res.data.record.category.name);
          setTitle(res.data.record.title);
          setStatus(res.data.record.is_available);
          setBorrower(res.data.issuedRecord.borrower.name);
          setDepartment(res.data.issuedRecord.borrower.department.name);
          setDueDate(res.data.issuedRecord.due_date);
          setReDueDate(res.data.issuedRecord.re_due_date);
        })
        .catch((err) =>
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${err?.response?.data?.message}`,
          })
        );
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Barcode is Empty`,
      });
    }
  };

  const redirect = () => {
    Swal.fire({
      title: "Would you like to Proceed?",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      icon: "question",
    }).then((result) => {
      if (result.isConfirmed) {
        if (category === "Book") {
          router.push(`/books/detail/${id}`);
        }
        if (category === "Journal") {
          router.push(`/journals/detail/${id}`);
        }
        if (category === "Magazine") {
          router.push(`/magazines/detail/${id}`);
        }
        if (category === "Novel") {
          router.push(`/novels/detail/${id}`);
        }
      }
    });
  };

  return (
    <Layoutt>
      <div className="bg-white border-4 rounded-lg shadow relative m-10">
        <div className="flex justify-center p-5  border-b rounded-t">
          <h3 className="text-3xl  text-sky-700 font-bold">Barcode Scan</h3>
        </div>
        <Formik>
          <Form className="p-6 space-y-6">
            <div className="border-b border-gray-900/10 pb-4">
              <h3 className="text-xl font-bold leading-7 pt-4 px-2 text-gray-900">
                Barcode
              </h3>
            </div>
            <Stack width={300} direction={"row"}>
              <FieldsControls
                control="text"
                name="barcode-scan-result"
                label="Barcode"
                value={barcode}
                onChange={(e) => {
                  setBarcode(e.target.value);
                }}
              />
            </Stack>
            <Stack direction={"row"} spacing={2}>
              <Button
                onClick={initQuagga}
                className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
              >
                Scan
              </Button>
              <Button
                onClick={assetRecord}
                className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
              >
                Search
              </Button>
            </Stack>
            <div className="border-b border-gray-900/10 pb-4">
              <h3 className="text-xl font-bold leading-7 pt-4 px-2 text-gray-900">
                Library Asset Details
              </h3>
            </div>
            <Stack direction={"row"} spacing={2}>
              <FieldsControls
                control="readOnly"
                name="title"
                label="Title"
                value={title}
                InputProps={{
                  readOnly: true,
                }}
              />
              <FieldsControls
                control="readOnly"
                name="category"
                label="Category"
                value={category}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Stack>
            <Stack sx={{ width: "49.2%" }}>
              <FieldsControls
                control="readOnly"
                name="status"
                label="Status"
                value={status}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Stack>
            <div className="border-b border-gray-900/10 pb-4">
              <h3 className="text-xl font-bold leading-7 pt-4 px-2 text-gray-900">
                User Details
              </h3>
            </div>
            <Stack direction={"row"} spacing={2}>
              <FieldsControls
                control="readOnly"
                name="name"
                label="Name"
                value={borrower}
                InputProps={{
                  readOnly: true,
                }}
              />
              <FieldsControls
                control="readOnly"
                name="department"
                label="Department"
                value={department}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Stack>
            <div className="border-b border-gray-900/10 pb-4">
              <h3 className="text-xl font-bold leading-7 pt-4 px-2 text-gray-900">
                Issuance Details
              </h3>
            </div>
            <Stack direction={"row"} spacing={2}>
              <FieldsControls
                control="readOnly"
                name="due_date"
                label="Due Date"
                value={dueDate}
                InputProps={{
                  readOnly: true,
                }}
              />
              <FieldsControls
                control="readOnly"
                name="re_due_date"
                label="Re-Due Date"
                value={reDueDate}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Stack>
            <Stack direction={"row"} className="flex justify-end">
              <Button
                onClick={redirect}
                className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
              >
                Proceed
              </Button>
            </Stack>
          </Form>
        </Formik>
      </div>
    </Layoutt>
  );
}

export default scan;

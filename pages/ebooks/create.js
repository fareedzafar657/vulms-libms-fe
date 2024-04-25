import React, { useState, useEffect } from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import { Button, Stack } from "@mui/material";
import Swal from "sweetalert2";
import FieldsControls from "../../component/FormikControls/FieldsControls";
import TextField from "@mui/material/TextField";
import * as Yup from "yup";
import Layoutt from "../../component/lay/Layoutt";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useRouter } from "next/router";
import useAxiosAuth from "../../lib/hooks/useAxiosAuth";
import { getSession } from "next-auth/react";
import AutocompleteField from "../../component/FormikControls/AutocompleteFieldfreeSolo";

function ebooks() {
  const router = useRouter();
  const [publishers, setPublishers] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [material_types, setMaterial_types] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [showPurchaseDetails, setShowPurchaseDetails] = useState(false);
  const [showDonationDetails, setShowDonationDetails] = useState(false);
  const [authors, setAuthors] = useState([]);
  const axiosAuth = useAxiosAuth();
  const handleRadioChange = (event) => {
    const value = event.target.value;

    setShowPurchaseDetails(value === "purchase");
    setShowDonationDetails(value === "donated");
  };

  useEffect(() => {
    const api = async () => {
      const session = await getSession();
      axios
        .get("/ebooks/create", {
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
          },
        })
        .then((res) => {
          const {
            distributors,
            languages,
            departments,
            material_types,
            publishers,
            currencies,
            authors,
          } = res.data;
          setPublishers(publishers);
          setDistributors(distributors);
          setMaterial_types(material_types);
          setLanguages(languages);
          setDepartments(departments);
          setCurrencies(currencies);
          setAuthors(authors);
        })
        .catch((err) => console.error(err));
    };
    api();
  }, []);
  const validationSchema = Yup.object().shape({
    call_no: Yup.string()
      .required(" required")
      .trim()
      .matches(/^\d+$/, "blank spaces are not allowed"),
    title: Yup.string().required(" required"),
    author: Yup.string().required(" required"),
    publisherId: Yup.string().required(" required"),
    material_typeId: Yup.string().required(" required"),
    languageId: Yup.string().required(" required"),
    departmentId: Yup.string().required(" required"),
  });
  const initialValues = {
    cover: null,
    pdf: null,
    title: "",
    call_no: "",
    subTitle: "",
    author: "",
    subAuthor: [],
    edition_no: "",
    ddc_classification_no: "",
    publisherId: "",
    distributerId: "",
    material_typeId: "",
    publishing_year: "",
    date_of_purchase: "",
    price: "",
    currencyId: "",
    total_pages: "",
    languageId: "",
    departmentId: "",
    description: "",
    donated_by: "",
    isbn_no: "",
  };

  const handleSubmit = async (values) => {
    try {
      const nonEmptyValues = Object.entries(values)
        .filter(([key, value]) => {
          return (
            value !== null &&
            value !== undefined &&
            value !== "" &&
            !(Array.isArray(value) && value.length === 0)
          );
        })
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      const formData = new FormData();
      Object.entries(nonEmptyValues).forEach(([key, value]) => {
        if (key === "cover") {
          formData.append("cover", value);
        } else if (key === "pdf") {
          formData.append("pdf", value);
        } else {
          formData.append(key, value);
        }
      });

      const response = await axiosAuth.post("/ebooks/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire("Successful!", "You added a e-book!", "success");
      router.push(`/ebooks/list`);
    } catch (error) {
      Swal.fire("you failed to add e-book!", error.response.data.data, "error");
      console.error("Failed:", error.response.data.data);
    }
  };

  return (
    <Layoutt>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {(formProps) => (
          <div className="bg-white   border-4 rounded-lg shadow relative m-10">
            <div className="flex justify-center p-5  border-b rounded-t">
              <h3 className="text-3xl  text-sky-700 font-bold">Add e-Book</h3>
            </div>
            <div className="border-b border-gray-900/10 pb-4">
              <h3 className="text-xl font-bold leading-7 pt-4 px-8 text-gray-900">
                E-Book Cover
              </h3>
            </div>

            <div className="max-w-sm pt-2 px-24">
              <img
                src={
                  formProps.values["Choose cover"]
                    ? URL.createObjectURL(formProps.values["Choose cover"])
                    : `${process.env.NEXT_PUBLIC_BE_URL}/avatar/noImage.jpg`
                }
                alt="Choose Photo"
                className="selected-image"
              />
              <label className="inline-flex cursor-pointer appearance-none rounded-l-md border border-gray-200 bg-white px-3 py-2 text-sm transition focus:z-10 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75">
                Choose Cover
                <input
                  type="file"
                  onChange={(event) => {
                    const selectedFile = event.target.files[0];
                    formProps.setFieldValue("cover", selectedFile);

                    if (selectedFile) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        document.querySelector(".selected-image").src =
                          e.target.result;
                      };
                      reader.readAsDataURL(selectedFile);
                    }
                  }}
                />
              </label>

              <label className="inline-flex cursor-pointer appearance-none rounded-l-md border border-gray-200 bg-white px-3 py-2 text-sm transition focus:z-10 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75">
                Choose PDF
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(event) => {
                    const selectedPdf = event.target.files[0];
                    formProps.setFieldValue("pdf", selectedPdf);
                  }}
                  required
                />
              </label>
            </div>
            <div className="border-b border-gray-900/10 pb-4">
              <h3 className="text-xl font-bold leading-7 pt-4 px-8 text-gray-900">
                e-book Details
              </h3>
            </div>

            <Form className="p-6 space-y-6">
              <Stack spacing={2} direction={"row"}>
                <FieldsControls
                  id="outlined-basic"
                  variant="outlined"
                  control="text"
                  name="title"
                  label="Title"
                  error={
                    formProps.errors.title && formProps.touched.title
                      ? true
                      : false
                  }
                  required
                />
                {/* <ErrorMessage
                  name="title"
                  component="div"
                  render={(msg) => <span className="text-red-500 ">{msg}</span>}
                /> */}

                <FieldsControls
                  id="outlined-basic"
                  variant="outlined"
                  control="text"
                  name="call_no"
                  label="Call No"
                  placeholder="892.7109"
                  required
                  error={
                    formProps.errors.call_no && formProps.touched.call_no
                      ? true
                      : false
                  }
                />
              </Stack>
              <Stack spacing={2} direction={"row"}>
                <FieldsControls
                  id="outlined-basic"
                  variant="outlined"
                  control="text"
                  name="subTitle"
                  label="Sub Title"
                />

                <FieldsControls
                  id="outlined-basic"
                  variant="outlined"
                  control="text"
                  name="isbn_no"
                  label="ISBN No"
                />
              </Stack>

              <Stack spacing={2} direction={"row"}>
                <FieldsControls
                  id="outlined-basic"
                  variant="outlined"
                  control="text"
                  name="author"
                  label="Author"
                  required
                  error={
                    formProps.errors.author && formProps.touched.author
                      ? true
                      : false
                  }
                />
                {/* <ErrorMessage
                  name="author"
                  render={(msg) => <span className="text-red-500 ">{msg}</span>}
                /> */}

                <FieldsControls
                  control="text"
                  id="outlined-basic"
                  variant="outlined"
                  name="publishing_year"
                  label="Publishing Year"
                />
              </Stack>
              <Stack spacing={2} direction={"row"}>
                <Field
                  name="subAuthor"
                  component={AutocompleteField}
                  label="Sub Authors"
                  options={authors}
                />

                <FieldsControls
                  control="text"
                  id="outlined-basic"
                  variant="outlined"
                  name="total_pages"
                  label="Total Pages"
                />
              </Stack>

              <Stack spacing={2} direction={"row"}>
                <FieldsControls
                  control="text"
                  id="outlined-basic"
                  variant="outlined"
                  name="edition_no"
                  label="Edition No"
                />

                <FieldsControls
                  id="outlined-basic"
                  variant="outlined"
                  control="select"
                  name="languageId"
                  label="Language *"
                  labelId="languageLabel"
                  options={languages}
                  required
                  error={
                    formProps.errors.languageId && formProps.touched.languageId
                      ? true
                      : false
                  }
                />
                {/* <ErrorMessage
                  name="languageId"
                  render={(msg) => <span className="text-red-500 ">{msg}</span>}
                /> */}
              </Stack>

              <Stack spacing={2} direction={"row"}>
                <FieldsControls
                  control="select"
                  name="publisherId"
                  label="Publisher *"
                  labelId="publisherLabel"
                  options={publishers}
                  required
                  error={
                    formProps.errors.publisherId &&
                    formProps.touched.publisherId
                      ? true
                      : false
                  }
                />
                {/* <ErrorMessage
                  name="publisherId"
                  component="div"
                  render={(msg) => <span className="text-red-500 ">{msg}</span>}
                /> */}

                <FieldsControls
                  control="select"
                  name="departmentId"
                  label="Department *"
                  labelId="departmentLabel"
                  options={departments}
                  required
                  error={
                    formProps.errors.departmentId &&
                    formProps.touched.departmentId
                      ? true
                      : false
                  }
                />
                {/* <ErrorMessage
                  name="departmentId"
                  component="div"
                  render={(msg) => <span className="text-red-500 ">{msg}</span>}
                /> */}
              </Stack>

              <Stack spacing={2} direction={"row"}>
                <FieldsControls
                  control="select"
                  name="material_typeId"
                  label="Material Type *"
                  labelId="materialTypeLabel"
                  options={material_types}
                  required
                  error={
                    formProps.errors.material_typeId &&
                    formProps.touched.material_typeId
                      ? true
                      : false
                  }
                />
                {/* <ErrorMessage
                  name="material_typeId"
                  component="div"
                  render={(msg) => <span className="text-red-500 ">{msg}</span>}
                /> */}
                <FieldsControls
                  control="text"
                  id="outlined-basic"
                  variant="outlined"
                  name="ddc_classification_no"
                  label="DDC Classification No"
                />
              </Stack>
              <Stack spacing={2} direction={"row"}>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  onChange={handleRadioChange}
                >
                  <FormControlLabel
                    value="purchase"
                    control={<Radio />}
                    label="Purchase"
                  />
                  <FormControlLabel
                    value="donated"
                    control={<Radio />}
                    label="Donated"
                  />
                </RadioGroup>
              </Stack>
              {showPurchaseDetails && (
                <>
                  <div className="flex items-start justify-between  border-b rounded-t">
                    <h3 className="text-xl  text-black font-bold">
                      Purchase Details
                    </h3>
                  </div>

                  <Stack spacing={2} direction={"row"}>
                    <FieldsControls
                      id="outlined-basic"
                      variant="outlined"
                      control="text"
                      type="date"
                      name="date_of_purchase"
                      label="Date of Purchase"
                      value={formProps.values.date_of_purchase}
                      onChange={formProps.handleChange}
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />

                    <FieldsControls
                      id="outlined-basic"
                      variant="outlined"
                      control="text"
                      name="price"
                      label="Price"
                      value={formProps.values.price}
                      onChange={formProps.handleChange}
                    />

                    <FieldsControls
                      control="select"
                      name="currencyId"
                      label="Currency"
                      labelId="currencyLabel"
                      options={currencies}
                      value={formProps.values.currencyId}
                      onChange={formProps.handleChange}
                    />
                  </Stack>
                  <Stack spacing={2} direction={"row"}>
                    <FieldsControls
                      control="select"
                      name="distributerId"
                      label="Distributor"
                      labelId="distributorLabel"
                      sx={{ width: "600px" }}
                      options={distributors}
                      value={formProps.values.distributerId}
                      onChange={formProps.handleChange}
                    />
                  </Stack>
                </>
              )}
              {showDonationDetails && (
                <>
                  <div className="flex items-start justify-between  border-b rounded-t">
                    <h3 className="text-xl  text-black font-bold">
                      Donation Details
                    </h3>
                  </div>
                  <Stack spacing={2} direction={"row"} sx={{ width: "500px" }}>
                    <FieldsControls
                      id="outlined-basic"
                      variant="outlined"
                      control="text"
                      name="donated_by"
                      label="Donator"
                      value={formProps.values.donated_by}
                      onChange={formProps.handleChange}
                    />
                  </Stack>
                </>
              )}

              <Stack spacing={2} direction={"row"}>
                <FieldsControls
                  id="outlined-basic"
                  variant="outlined"
                  control="text"
                  name="description"
                  label="Description"
                  multiline
                  rows={4}
                />
              </Stack>

              <Stack direction={"row"} spacing={2} className="flex justify-end">
                <Button
                  size="small"
                  variant="contained"
                  className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                  onClick={() => router.push(`/ebooks/list`)}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  type="submit"
                  className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
                >
                  Save
                </Button>
              </Stack>
            </Form>
          </div>
        )}
      </Formik>
    </Layoutt>
  );
}
export default ebooks;

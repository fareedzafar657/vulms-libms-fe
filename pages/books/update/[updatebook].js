import { Button, Stack } from "@mui/material";
import axios from "axios";
import { Form, Formik, ErrorMessage, Field } from "formik";
import { useRouter, router } from "next/router";
import React, { useState, useEffect } from "react";
import FieldsControls from "../../../component/FormikControls/FieldsControls";
import Swal from "sweetalert2";
import Layoutt from "../../../component/lay/Layoutt";
import * as Yup from "yup";
import { getSession } from "next-auth/react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import AutocompleteField from "@/component/FormikControls/AutocompleteFieldfreeSolo";

export async function getServerSideProps(context) {
  const { params } = context;
  const session = await getSession(context);

  const response = await axios.get(`/books/update/${params.updatebook}`, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });
  const { data } = response;
  return {
    props: {
      bookRecord: data.bookRecord,
      categories: data.categories,
      publishers: data.publishers,
      distributors: data.distributors,
      languages: data.languages,
      locations: data.locations,
      material_types: data.material_types,
      currencies: data.currencies,
      departments: data.departments,
      authors: data.authors,
    },
  };
}

const validationSchema = Yup.object().shape({
  call_no: Yup.string()
    .required(" required")
    .trim()
    .matches(/^\d+$/, "blank spaces are not allowed"),
  title: Yup.string().required("required"),
  author: Yup.string().required("required"),
  publisherId: Yup.string().required("required"),
  material_typeId: Yup.string().required("required"),
  languageId: Yup.string().required("required"),
  locationId: Yup.string().required("required"),
  location_placed: Yup.string().required("required"),
  departmentId: Yup.string().required("required"),
});

function updatebook({
  bookRecord,
  categories,
  publishers,
  distributors,
  languages,
  locations,
  material_types,
  currencies,
  departments,
  authors,
}) {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const [showPurchaseDetails, setShowPurchaseDetails] = useState(false);
  const [showDonationDetails, setShowDonationDetails] = useState(false);

  const handleRadioChange = (event) => {
    const value = event.target.value;

    setShowPurchaseDetails(value === "purchase");
    setShowDonationDetails(value === "donated");
  };

  const initialValues = {
    file: null,
    call_no: `${bookRecord.call_no}`,
    title: `${bookRecord.title}`,
    subTitle: `${bookRecord.subTitle}`,
    author: `${bookRecord.author}`,
    subAuthor: bookRecord.subAuthor,
    edition_no: `${bookRecord.edition_no}`,
    publisherId: `${bookRecord.publisher.id}`,
    distributerId: bookRecord.distributer ? `${bookRecord.distributer.id}` : "",
    accompanying_material: `${bookRecord.accompanying_material}`,
    material_typeId: `${bookRecord.material_type.id}`,
    isbn_no: `${bookRecord.isbn_no}`,
    ddc_classification_no: `${bookRecord.ddc_classification_no}`,
    publishing_year: `${bookRecord.publishing_year}`,
    date_of_purchase: `${bookRecord.date_of_purchase}`,
    price: `${bookRecord.price}`,
    currencyId: bookRecord.currency ? `${bookRecord.currency.id}` : "",
    total_pages: `${bookRecord.total_pages}`,
    languageId: `${bookRecord.language.id}`,
    locationId: `${bookRecord.location.id}`,
    location_placed: `${bookRecord.location_placed}`,
    departmentId: `${bookRecord.department.id}`,
    description: `${bookRecord.description}`,
    donated_by: `${bookRecord.donated_by}`,
  };

  const handleSubmit = async (values, bookId) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (values[key] !== initialValues[key] && value !== "") {
          if (key === "file") {
            formData.append("file", value);
          } else {
            formData.append(key, value);
          }
        }
      });

      const response = await axiosAuth.patch(
        `/books/update/${bookId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.fire("Successful!", "You updated a book!", "success");
      // router.reload();
      router.push(`/books/list`);
    } catch (error) {
      Swal.fire(
        "you failed to updated a book!",
        error.response.data.data,
        "error"
      );
      console.error("Failed:", error.response.data.data);
    }
  };
  return (
    <Layoutt>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => handleSubmit(values, bookRecord.id)}
        validationSchema={validationSchema}
      >
        {(formProps) => (
          <div className="bg-white p-6 space-y-6  border-4 rounded-lg shadow relative ">
            <div className="flex justify-center p-5 border-b rounded-t">
              <h3 className="text-3xl  text-sky-700 font-bold">Update Book</h3>
            </div>
            <div className="border-b border-gray-900/10 pb-4">
              <h2 className="text-base font-bold leading-7 pt-4 px-8 text-gray-900">
                Book Cover
              </h2>
            </div>
            {/* <div className="max-w-sm pt-2 px-24 ">
              <input
                type="file"
                onChange={(event) =>
                  formProps.setFieldValue("file", event.target.files[0])
                }
              />
            </div> */}
            <div className="max-w-sm pt-2 px-24">
              <img
                src={
                  formProps.values["Choose Photo"]
                    ? URL.createObjectURL(formProps.values["Choose Photo"])
                    : `${process.env.NEXT_PUBLIC_BE_URL}${bookRecord.cover}`
                }
                alt="Selected"
                className="selected-image"
              />
              <label className="inline-flex cursor-pointer appearance-none rounded-l-md border border-gray-200 bg-white px-3 py-2 text-sm transition focus:z-10 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75">
                Choose Cover
                <input
                  type="file"
                  onChange={(event) => {
                    const selectedFile = event.target.files[0];
                    formProps.setFieldValue("file", selectedFile);

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
            </div>
            <div className="border-b border-gray-900/10 pb-4">
              <h2 className="text-base font-semibold leading-7 pt-4 px-8 text-gray-900">
                Book Details
              </h2>
            </div>

            <Form className="p-6 space-y-6">
              <Stack spacing={2} direction={"row"}>
                <FieldsControls
                  id="outlined-basic"
                  variant="outlined"
                  control="text"
                  name="title"
                  label="Title"
                  required
                  error={
                    formProps.errors.title && formProps.touched.title
                      ? true
                      : false
                  }
                />
                {/* <ErrorMessage
                  name="title"
                  component="div"
                  render={(msg) => <span className="text-red-500 ">{msg}</span>}
                /> */}
                <FieldsControls
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
                  variant="outlined"
                  control="text"
                  name="subTitle"
                  label="Sub Title"
                />
                <FieldsControls
                  variant="outlined"
                  control="text"
                  name="isbn_no"
                  label="ISBN No"
                />
              </Stack>
              <Stack spacing={2} direction={"row"}>
                <FieldsControls
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
                  variant="outlined"
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
              </Stack>
              <Stack spacing={2} direction={"row"}>
                <Field
                  name="subAuthor"
                  component={AutocompleteField}
                  label="Sub Authors"
                  options={authors}
                />
                <FieldsControls
                  variant="outlined"
                  control="text"
                  name="total_pages"
                  label="Total Pages"
                />
              </Stack>
              <Stack spacing={2} direction={"row"}>
                <FieldsControls
                  variant="outlined"
                  control="text"
                  name="edition_no"
                  label="Edition No"
                />
                <FieldsControls
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
                  variant="outlined"
                  control="text"
                  name="publishing_year"
                  label="Publishing Year"
                />
                <FieldsControls
                  variant="outlined"
                  control="select"
                  name="locationId"
                  label="Location *"
                  labelId="locationLabel"
                  options={locations}
                  required
                  error={
                    formProps.errors.locationId && formProps.touched.locationId
                      ? true
                      : false
                  }
                />
              </Stack>
              <Stack spacing={2} direction={"row"}>
                <FieldsControls
                  variant="outlined"
                  control="text"
                  name="accompanying_material"
                  label="Accompanying Material"
                />

                <FieldsControls
                  variant="outlined"
                  control="text"
                  name="location_placed"
                  label="Shelve Location"
                  required
                  error={
                    formProps.errors.location_placed &&
                    formProps.touched.location_placed
                      ? true
                      : false
                  }
                />
              </Stack>

              <Stack spacing={2} direction={"row"}>
                <FieldsControls
                  variant="outlined"
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
                <FieldsControls
                  variant="outlined"
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
                  <div className="border-b border-gray-900/10 pb-4">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                      Purchase Details
                    </h2>
                  </div>
                  <Stack spacing={2} direction={"row"}>
                    <FieldsControls
                      variant="outlined"
                      control="text"
                      type="date"
                      name="date_of_purchase"
                      label="Date of Purchase"
                      value={formProps.values.date_of_purchase}
                      onChange={formProps.handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <FieldsControls
                      variant="outlined"
                      control="text"
                      type="1234"
                      name="price"
                      label="Price"
                      value={formProps.values.price}
                      onChange={formProps.handleChange}
                    />

                    <FieldsControls
                      variant="outlined"
                      control="select"
                      name="currencyId"
                      label="Currency"
                      labelId="currencyLabel"
                      options={currencies}
                      value={formProps.values.currencyId}
                      onChange={formProps.handleChange}
                    />
                  </Stack>
                  <Stack spacing={2} direction={"row"} width="32%">
                    <FieldsControls
                      variant="outlined"
                      control="select"
                      name="distributerId"
                      label="Distributor"
                      labelId="distributorLabel"
                      options={distributors}
                      value={formProps.values.distributerId}
                      onChange={formProps.handleChange}
                    />
                  </Stack>
                </>
              )}

              {showDonationDetails && (
                <>
                  <div className="border-b border-gray-900/10 pb-4">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                      Donation Details
                    </h2>
                  </div>
                  <Stack spacing={2} direction={"row"} width="32%">
                    <FieldsControls
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
                  type="button"
                  onClick={() => router.push(`/books/list`)}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
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

export default updatebook;

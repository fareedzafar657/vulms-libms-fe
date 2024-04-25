import { Button, Stack } from "@mui/material";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import FieldsControls from "../../../component/FormikControls/FieldsControls";
import Swal from "sweetalert2";
import Layoutt from "../../../component/lay/Layoutt";
import * as Yup from "yup";

import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { getSession } from "next-auth/react";
import useAxiosAuth from "../../../lib/hooks/useAxiosAuth";
import AutocompleteField from "@/component/FormikControls/AutocompleteFieldfreeSolo";

export async function getServerSideProps(context) {
  const { params } = context;
  const session = await getSession(context);
  const response = await axios.get(`/novels/update/${params.updatenovel}`, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });
  const { data } = response;
  return {
    props: {
      novelRecord: data.novelRecord,
      categories: data.categories,
      distributors: data.distributors,
      publishers: data.publishers,
      languages: data.languages,
      locations: data.locations,
      material_types: data.material_types,
      currencies: data.currencies,
      authors: data.authors,
    },
  };
}

function updatenovel({
  novelRecord,
  publishers,
  distributors,
  languages,
  locations,
  material_types,
  currencies,
  authors,
}) {
  const router = useRouter();
  const [showPurchaseDetails, setShowPurchaseDetails] = useState(false);
  const [showDonationDetails, setShowDonationDetails] = useState(false);
  const axiosAuth = useAxiosAuth();

  const handleRadioChange = (event) => {
    const value = event.target.value;

    setShowPurchaseDetails(value === "purchase");
    setShowDonationDetails(value === "donated");
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("required"),
    material_typeId: Yup.string().required("required"),
    author: Yup.string().required("required"),
    languageId: Yup.string().required("required"),
    locationId: Yup.string().required("required"),
    publisherId: Yup.string().required("required"),
    location_placed: Yup.string().required("required"),
  });

  const initialValues = {
    file: null,
    title: `${novelRecord.title}`,
    subTitle: `${novelRecord.subTitle}`,
    author: `${novelRecord.author}`,
    subAuthor: novelRecord.subAuthor,
    volume_no: `${novelRecord.volume_no}`,
    publisherId: `${novelRecord.publisher.id}`,
    distributerId: novelRecord.distributer
      ? `${novelRecord.distributer.id}`
      : "",

    date_of_purchase: `${novelRecord.date_of_purchase}`,
    publishing_year: `${novelRecord.publishing_year}`,
    price: `${novelRecord.price}`,
    currencyId: novelRecord.currency ? `${novelRecord.currency.id}` : "",
    total_pages: `${novelRecord.total_pages}`,
    material_typeId: `${novelRecord.material_type.id}`,
    languageId: `${novelRecord.language.id}`,
    locationId: `${novelRecord.location.id}`,
    location_placed: `${novelRecord.location_placed}`,
    description: `${novelRecord.description}`,
    donated_by: `${novelRecord.donated_by}`,
  };

  const handleSubmit = async (values, novelId) => {
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
        `/novels/update/${novelId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.fire("Successful!", "You updated a novel!", "success");
      router.push(`/novels/list`);
    } catch (error) {
      Swal.fire("failed!", "You failed to update a novel!", "");
      console.error("Failed:", error.message);
    }
  };

  return (
    <Layoutt>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => handleSubmit(values, novelRecord.id)}
        validationSchema={validationSchema}
      >
        {(formProps) => (
          <div className="bg-white p-6 space-y-6  border-4 rounded-lg shadow relative ">
            <div className="flex justify-center p-5 border-b rounded-t">
              <h3 className="text-3xl  text-sky-700 font-bold">Update Novel</h3>
            </div>
            <div className="border-b border-gray-900/10 pb-4">
              <h2 className="text-base font-bold leading-7 pt-4 px-8 text-gray-900">
                Novel Cover
              </h2>
            </div>

            <div className="max-w-sm pt-2 px-24">
              <img
                src={
                  formProps.values["Choose Photo"]
                    ? URL.createObjectURL(formProps.values["Choose Photo"])
                    : `${process.env.NEXT_PUBLIC_BE_URL}${novelRecord.cover}`
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
                Novel Details
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
                  render={(msg) => <span className="text-red-500 ">{msg}</span>}
                /> */}
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
                  name="publishing_year"
                  label="Publishing Year"
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
                  id="outlined-basic"
                  variant="outlined"
                  control="text"
                  name="total_pages"
                  label="Total Pages"
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
                  id="outlined-basic"
                  variant="outlined"
                  control="text"
                  name="volume_no"
                  label="Volume No"
                />

                <FieldsControls
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
                {/* <ErrorMessage
                  name="locationId"
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
                  error={
                    formProps.errors.publisherId &&
                    formProps.touched.publisherId
                      ? true
                      : false
                  }
                />

                <FieldsControls
                  id="outlined-basic"
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
                {/* <ErrorMessage
                  name="location_placed"
                  render={(msg) => <span className="text-red-500 ">{msg}</span>}
                /> */}
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
                      id="outlined-basic"
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
                      id="outlined-basic"
                      variant="outlined"
                      control="text"
                      placeholder="1234"
                      name="price"
                      label="Price"
                      value={formProps.values.price}
                      onChange={formProps.handleChange}
                    />

                    <FieldsControls
                      id="outlined-basic"
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
                      id="outlined-basic"
                      variant="outlined"
                      control="select"
                      name="distributerId"
                      label="Distributor"
                      labelId="distributorLabel"
                      options={distributors}
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
                      id="outlined-basic"
                      variant="outlined"
                      control="text"
                      name="donated_by"
                      label="Donator"
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
                  type="button"
                  onClick={() => router.push(`/novels/list`)}
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

export default updatenovel;

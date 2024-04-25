import React, { useState, useEffect } from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import { Button, Stack } from "@mui/material";
import Swal from "sweetalert2";

import FieldsControls from "../../../component/FormikControls/FieldsControls";
import TextField from "@mui/material/TextField";
import * as Yup from "yup";

import Layoutt from "../../../component/lay/Layoutt";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useRouter, router } from "next/router";
import { getSession } from "next-auth/react";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";

export async function getServerSideProps(context) {
  const { params } = context;
  const session = await getSession(context);
  const response = await axios.get(
    `/magazines/update/${params.updateMagazine}`,
    {
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
      },
    }
  );
  const { data } = response;
  return {
    props: {
      magazineRecord: data.magazineRecord,

      publishers: data.publishers,
      distributors: data.distributors,
      languages: data.languages,
      locations: data.locations,
      material_types: data.material_types,
      currencies: data.currencies,
    },
  };
}

function updateMagazine({
  magazineRecord,

  publishers,
  distributors,
  languages,
  locations,
  material_types,
  currencies,
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
    title: `${magazineRecord.title}`,
    subTitle: `${magazineRecord?.subTitle}`,
    volume_no: `${magazineRecord?.volume_no}`,
    version_no: `${magazineRecord?.version_no}`,
    publisherId: `${magazineRecord?.publisher.id}`,
    distributerId: magazineRecord?.distributer
      ? `${magazineRecord?.distributer.id}`
      : null,
    material_typeId: `${magazineRecord?.material_type.id}`,
    publishing_date: `${magazineRecord.publishing_date}`,
    date_of_purchase: `${magazineRecord?.date_of_purchase}`,
    price: `${magazineRecord?.price}`,
    currencyId: magazineRecord?.currency
      ? `${magazineRecord?.currency?.id}`
      : null,
    total_pages: `${magazineRecord?.total_pages}`,
    languageId: `${magazineRecord?.language.id}`,
    locationId: `${magazineRecord?.location.id}`,
    location_placed: `${magazineRecord?.location_placed}`,
    description: `${magazineRecord?.description}`,
    donated_by: `${magazineRecord?.donated_by}`,
  };
  const handleSubmit = async (values, magazineId) => {
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
        `/magazines/update/${magazineId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire("Successful!", "You updated a magazine!", "success");
      // router.reload();
      router.push(`/magazines/list`);
    } catch (error) {
      Swal.fire(
        "you failed to updated a Magazine!",
        error.response.data.data,
        "error"
      );
      console.error("Failed:", error.response.data.data);
    }
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("required"),
    languageId: Yup.string().required("required"),
    locationId: Yup.string().required("required"),
    publisherId: Yup.string().required("required"),
    location_placed: Yup.string().required("required"),
    material_typeId: Yup.string().required("required"),
    // total_pages: Yup.string()
    //   .trim()
    //   .matches(/^\S*$/, "Total Pages must not contain blank spaces"),
    // volume_no: Yup.string()
    //   .trim()
    //   .matches(/^\S*$/, "Volume no. must not contain blank spaces"),
    // version_no: Yup.string()
    //   .trim()
    //   .matches(/^\S*$/, "Version no. must not contain blank spaces"),
    // date_of_purchase: Yup.string()
    //   .trim()
    //   .matches(/^\S*$/, " Date of Purchase must not contain blank spaces"),
    // price: Yup.string()
    //   .trim()
    //   .matches(/^\S*$/, "Price must not contain blank spaces"),
  });

  return (
    <Layoutt>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => handleSubmit(values, magazineRecord.id)}
        validationSchema={validationSchema}
      >
        {(formProps) => (
          <div className=" mb-20">
            <div className="bg-white   border-4 rounded-lg shadow relative m-10">
              <div className="flex justify-center p-5  border-b rounded-t">
                <h3 className="text-3xl  text-sky-700 font-bold">
                  Update Magazine
                </h3>
              </div>
              <div className="border-b border-gray-900/10 pb-4">
                <h3 className="text-xl font-bold leading-7 pt-4 px-8 text-gray-900">
                  Magazine Cover
                </h3>
              </div>

              <div className="max-w-sm pt-2 px-24">
                <img
                  src={
                    formProps.values["Choose Photo"]
                      ? URL.createObjectURL(formProps.values["Choose Photo"])
                      : `${process.env.NEXT_PUBLIC_BE_URL}${magazineRecord.cover}`
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
                <h3 className="text-xl font-bold leading-7 pt-4 px-8 text-gray-900">
                  Magazine Details
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
                    render={(msg) => (
                      <span className="text-red-500 ">{msg}</span>
                    )}
                  /> */}

                  <FieldsControls
                    id="outlined-basic"
                    variant="outlined"
                    control="text"
                    name="publishing_date"
                    label="Publishing_Date"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
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
                    name="total_pages"
                    label="Total Pages"
                  />
                </Stack>

                <Stack spacing={2} direction={"row"}>
                  <FieldsControls
                    id="outlined-basic"
                    variant="outlined"
                    control="text"
                    name="version_no"
                    label="Version No"
                  />

                  <FieldsControls
                    control="select"
                    name="languageId"
                    label="Language *"
                    labelId="languageLabel"
                    options={languages}
                    required
                    error={
                      formProps.errors.languageId &&
                      formProps.touched.languageId
                        ? true
                        : false
                    }
                  />
                  {/* <ErrorMessage
                    name="languageId"
                    render={(msg) => (
                      <span className="text-red-500 ">{msg}</span>
                    )}
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
                      formProps.errors.locationId &&
                      formProps.touched.locationId
                        ? true
                        : false
                    }
                  />
                  {/* <ErrorMessage
                    name="locationId"
                    render={(msg) => (
                      <span className="text-red-500 ">{msg}</span>
                    )}
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
                    render={(msg) => (
                      <span className="text-red-500 ">{msg}</span>
                    )}
                  /> */}

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
                  {/* <ErrorMessage name="name">
                    {(errorMsg) => (
                      <div className="error  text-red-500 text-sm text-right">
                        {errorMsg}
                      </div>
                    )}
                  </ErrorMessage> */}
                </Stack>

                <Stack spacing={2} direction={"row"} width="49%">
                  <FieldsControls
                    control="select"
                    name="material_typeId"
                    label="Material Type *"
                    labelId="material_TypeLabel"
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
                    render={(msg) => (
                      <span className="text-red-500 ">{msg}</span>
                    )}
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
                        name="date_of_purchase"
                        label="Date of Purchase"
                        type="date"
                        value={formProps.values.date_of_purchase}
                        onChange={formProps.handleChange}
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
                    <Stack spacing={2} direction={"row"} width="32%">
                      <FieldsControls
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
                    <div className="flex items-start justify-between  border-b rounded-t">
                      <h3 className="text-xl  text-black font-bold">
                        Donation Details
                      </h3>
                    </div>
                    <Stack
                      spacing={2}
                      direction={"row"}
                      sx={{ width: "500px" }}
                    >
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
                <ErrorMessage name="name">
                  {(errorMsg) => (
                    <div className="error  text-red-500 text-sm text-right">
                      {errorMsg}
                    </div>
                  )}
                </ErrorMessage>
                <Stack
                  direction={"row"}
                  spacing={2}
                  className="flex justify-end"
                >
                  <Button
                    size="small"
                    variant="contained"
                    className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                    onClick={() => router.push(`/magazines/list`)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    type="submit"
                    className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
                  >
                    Update
                  </Button>
                </Stack>
              </Form>
            </div>
          </div>
        )}
      </Formik>
    </Layoutt>
  );
}

export default updateMagazine;

import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import { Button, Stack } from "@mui/material";
import Swal from "sweetalert2";

import FieldsControls from "../../../component/FormikControls/FieldsControls";
import * as Yup from "yup";

import Layoutt from "../../../component/lay/Layoutt";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import useAxiosAuth from "../../../lib/hooks/useAxiosAuth";

export async function getServerSideProps(context) {
  const { params } = context;
  const session = await getSession(context);
  const response = await axios.get(
    `/journals/update/${params.updatejournals}`,
    {
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
      },
    }
  );
  const { data } = response;
  return {
    props: {
      journalRecord: data.journalRecord,

      publishers: data.publishers,
      distributors: data.distributors,
      languages: data.languages,
      locations: data.locations,
      material_types: data.material_types,
      currencies: data.currencies,
    },
  };
}

function updateJournals({
  journalRecord,

  publishers,
  distributors,
  languages,
  locations,
  material_types,
  currencies,
}) {
  const [showPurchaseDetails, setShowPurchaseDetails] = useState(false);
  const [showDonationDetails, setShowDonationDetails] = useState(false);
  const axiosAuth = useAxiosAuth();
  const handleRadioChange = (event) => {
    const value = event.target.value;

    setShowPurchaseDetails(value === "purchase");
    setShowDonationDetails(value === "donated");
  };

  const router = useRouter();
  const initialValues = {
    file: null,
    title: `${journalRecord.title}`,
    subTitle: `${journalRecord.subTitle}`,
    volume_no: `${journalRecord.volume_no}`,
    publisherId: `${journalRecord.publisher?.id}`,
    distributerId: journalRecord.distributer
      ? `${journalRecord.distributer.id}`
      : null,
    material_typeId: `${journalRecord.material_type?.id}`,
    issn_no: `${journalRecord.issn_no}`,
    publishing_date: `${journalRecord.publishing_date}`,
    date_of_purchase: `${journalRecord.date_of_purchase}`,
    price: `${journalRecord.price}`,
    currencyId: journalRecord.currency ? `${journalRecord.currency.id}` : null,
    total_pages: `${journalRecord.total_pages}`,
    languageId: `${journalRecord.language?.id}`,
    locationId: `${journalRecord.location?.id}`,
    location_placed: `${journalRecord.location_placed}`,
    description: `${journalRecord.description}`,
    donated_by: `${journalRecord.donated_by}`,
  };
  const handleSubmit = async (values, journalId) => {
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
        `/journals/update/${journalId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.fire("Successful!", "You updated a journal!", "success");
      router.push(`/journals/list`);
    } catch (error) {
      Swal.fire(
        "you failed to updated a Journal!",
        error.response.data.data,
        "error"
      );
      console.error("Failed:", error.response.data.data);
    }
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("required"),
    issn_no: Yup.string().required("required"),
    languageId: Yup.string().required("required"),
    locationId: Yup.string().required("required"),
    publisherId: Yup.string().required("required"),
    location_placed: Yup.string().required("required"),
    material_typeId: Yup.string().required("required"),
  });

  return (
    <Layoutt>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => handleSubmit(values, journalRecord.id)}
        validationSchema={validationSchema}
      >
        {(formProps) => (
          <div className=" mb-20">
            <div className="bg-white   border-4 rounded-lg shadow relative m-10">
              <div className="flex justify-center p-5  border-b rounded-t">
                <h3 className="text-3xl  text-sky-700 font-bold">
                  Update Journals
                </h3>
              </div>
              <div className="border-b border-gray-900/10 pb-4">
                <h3 className="text-xl font-bold leading-7 pt-4 px-8 text-gray-900">
                  Journals Cover
                </h3>
              </div>

              <div className="max-w-sm pt-2 px-24">
                <img
                  src={
                    formProps.values["Choose Photo"]
                      ? URL.createObjectURL(formProps.values["Choose Photo"])
                      : `${process.env.NEXT_PUBLIC_BE_URL}${journalRecord.cover}`
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
                  Journals Details
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
                    label="Publishing Date"
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
                    name="issn_no"
                    label="ISSN No"
                    required
                    error={
                      formProps.errors.issn_no && formProps.touched.issn_no
                        ? true
                        : false
                    }
                  />
                  {/* <ErrorMessage
                    name="issn_no"
                    component="div"
                    render={(msg) => (
                      <span className="text-red-500 ">{msg}</span>
                    )}
                  /> */}

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
                    component="div"
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
                    component="div"
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
                  {/* <ErrorMessage
                    name="location_placed"
                    component="div"
                    render={(msg) => (
                      <span className="text-red-500 ">{msg}</span>
                    )}
                  /> */}
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
                    component="div"
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
                      sx={{ width: "600px" }}
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
                    onClick={() => router.push(`/journals/list`)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    type="submit"
                    className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
                  >
                    Updates
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

export default updateJournals;

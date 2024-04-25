import React, { useState, useEffect } from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import { Button, Stack } from "@mui/material";
import Swal from "sweetalert2";
import FieldsControls from "../../component/FormikControls/FieldsControls";
import Textarea from "@mui/joy/Textarea";
import TextField from "@mui/material/TextField";
import Layoutt from "../../component/lay/Layoutt";
import { useRouter } from "next/router";
import * as Yup from "yup";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { getSession } from "next-auth/react";
import AutocompleteField from "../../component/FormikControls/AutocompleteFieldfreeSolo";

function createBook() {
  const router = useRouter();
  const [publishers, setPublishers] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [material_types, setMaterial_types] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [showPurchaseDetails, setShowPurchaseDetails] = useState(false);
  const [showDonationDetails, setShowDonationDetails] = useState(false);

  const handleRadioChange = (event) => {
    const value = event.target.value;

    setShowPurchaseDetails(value === "purchase");
    setShowDonationDetails(value === "donated");
  };

  useEffect(() => {
    const api = async () => {
      const session = await getSession();
      axios
        .get("/books/create", {
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
          },
        })
        .then((res) => {
          const {
            departments,
            distributors,
            languages,
            locations,
            material_types,
            publishers,
            authors,
            currencies,
          } = res.data;
          setDepartments(departments);
          setPublishers(publishers);
          setDistributors(distributors);
          setMaterial_types(material_types);
          setLanguages(languages);
          setLocations(locations);
          setAuthors(authors);
          setCurrencies(currencies);
        })
        .catch((err) => console.error(err));
    };
    api();
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("required"),
    call_no: Yup.string().required("required"),
    author: Yup.string().required("required"),
    material_typeId: Yup.string().required("required"),
    publisherId: Yup.string().required("required"),
    languageId: Yup.string().required("required"),
    locationId: Yup.string().required("required"),
    location_placed: Yup.string().required("required"),
  });

  const initialValues = {
    file: null,
    call_no: "",
    title: "",
    subTitle: "",
    author: "",
    subAuthor: [],
    edition_no: "",
    publisherId: "",
    distributerId: "",
    accompanying_material: "",
    material_typeId: "",
    isbn_no: "",
    is_available: "",
    publishing_year: "",
    date_of_purchase: "",
    price: "",
    currencyId: "",
    total_pages: "",
    location_placed: "",
    languageId: "",
    locationId: "",
    departmentId: "",
    description: "",
    purchase: "",
    donated: "",
    donated_by: "",
    ddc_classification_no: "",
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
        if (key === "file") {
          formData.append("file", value);
        } else {
          formData.append(key, value);
        }
      });
      const session = await getSession();

      const response = await axios.post("/books/Create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${session?.user.access_token}`,
        },
      });

      Swal.fire("Successful!", "You added a Book!", "success");
      router.push(`/books/list`);
    } catch (error) {
      // console.error("Failed:", error.response.data.data);
      Swal.fire("you failed to add book!", error.response.data.data, "error");
      console.error("Failed:", error.response.data.data);
    }
  };

  return (
    <Layoutt>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        className="mx-auto  my-auto mt-5"
      >
        {(formProps) => (
          <div className="bg-white p-6 space-y-6 3xl:w-[1920px]    border-4 rounded-lg shadow relative ">
            <div className="flex justify-center p-5  border-b rounded-t">
              <h3 className="text-3xl  text-sky-700 font-bold">Add Book</h3>
            </div>
            <div className="border-b border-gray-900/10 pb-4">
              <h3 className="text-xl font-bold leading-7 pt-4 px-8 text-gray-900">
                Book Cover
              </h3>
            </div>

            <div className="max-w-sm pt-2 px-24">
              <img
                src={
                  formProps.values["Choose Photo"]
                    ? URL.createObjectURL(formProps.values["Choose Photo"])
                    : `${process.env.NEXT_PUBLIC_BE_URL}/avatar/noImage.jpg`
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
                Book Details
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
                  className="text-red-500"
                /> */}
                <FieldsControls
                  variant="outlined"
                  control="text"
                  name="call_no"
                  label="Call No"
                  placeholder="8927109"
                  error={
                    formProps.errors.call_no && formProps.touched.call_no
                      ? true
                      : false
                  }
                  required
                />
                {/* <ErrorMessage
                  name="call_no"
                  component="div"
                  className="text-red-500"
                /> */}
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
                  options={authors}
                  error={
                    formProps.errors.author && formProps.touched.author
                      ? true
                      : false
                  }
                  required
                />
                {/* <ErrorMessage
                  name="author"
                  component="div"
                  className="text-red-500"
                /> */}

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
                  type="year"
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
                  component="div"
                  render={(msg) => <span className="text-red-500 ">{msg}</span>}
                /> */}
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
                {/* <ErrorMessage
                  name="location_placed"
                  component="div"
                  className="text-red-500"
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
              <Stack spacing={2} direction={"row"} width="49.5%">
                <FieldsControls
                  variant="outlined"
                  control="text"
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
                  <div className="flex items-start justify-between border-b rounded-t">
                    <h3 className="text-xl text-black font-bold">
                      Purchase Details
                    </h3>
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
                      placeholder="1234"
                      name="price"
                      label="Price"
                      type="price"
                      value={formProps.values.price}
                      onChange={formProps.handleChange}
                    />

                    <FieldsControls
                      control="select"
                      name="currencyId"
                      label="Currency"
                      labelId="currencyLabel"
                      type="currency"
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
                  <div className="border-b border-gray-900/10 pb-4">
                    <h3 className="text-xl text-black font-bold">
                      Donation Details
                    </h3>
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
              {/* <div className="col-span-full">
                                <label for="product-details" name="description"
                label="Description"
                 className="text-sm font-medium text-gray-900 block mb-2">Description</label>
                                <textarea id="product-details" rows="6" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  block w-full p-4" placeholder="Details..."></textarea>
                            </div> */}
              {/* <TextField
                id="outlined-basic"
                variant="outlined"
                name="description"
                label="Description"
                multiline
                rows={4}
                className="w-full"
                placeholder="Type here..."
              /> */}
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
                  onClick={() => router.push(`/books/list`)}
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

export default createBook;

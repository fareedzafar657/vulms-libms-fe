import { Formik, Form } from "formik";
import { Stack, Button, Switch } from "@mui/material";
import FiltersControls from "../../Filters/FiltersControls";
import fetchBooksFilteredData from "./booksFilteredData";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import axios from "axios";

function BooksListFilters(props) {
  const {
    searchParams,
    setPagedata,
    router,
    setCurrentPage,
    publishers,
    distributers,
    material_types,
    languages,
    locations,
    authors,
    departments,
  } = props;
  const initialValues = {
    search: searchParams?.get("search")?.toString() || "",
    order: searchParams?.get("order")?.toString() || "",
    orderBy: searchParams?.get("orderBy")?.toString() || "",
    location: searchParams?.get("location")?.toString() || "",
    material_type: searchParams?.get("material_type")?.toString() || "",
    language: searchParams?.get("language")?.toString() || "",
    department: searchParams?.get("department")?.toString() || "",
    availability: parseInt(searchParams?.get("status")) || "",
    newArrival: parseInt(searchParams?.get("newArrival")) || 0,
  };
  const handleReset = {
    search: "",
    order: "",
    orderBy: "",
    location: "",
    material_type: "",
    language: "",
    department: "",
    availability: "",
    newArrival: 0,
  };
  const handleSubmit = async (data) => {
    const filteredData = await fetchBooksFilteredData(
      data,
      searchParams,
      router.replace
    );
    setPagedata(filteredData);
    setCurrentPage(1);
  };
  const orderByArray = [{ name: "Name" }];

  return (
    <>
      <h1 className="text-center text-sky-700 pb-4 font-bold text-2xl">
        Book List
      </h1>
      <div className="p-4 flex justify-center">
        <Accordion className="w-full  md:w-[800px] lg:w-[1000px] ">
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className="font-bold text-lg ">Filter</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {(formProps) => (
                <Form className="mb-12">
                  <Stack spacing={1} alignSelf={"center"}>
                    <Stack
                      direction={"row"}
                      width="100%"
                      alignSelf={"center"}
                      spacing={10}
                    >
                      <FiltersControls
                        id="outlined-basic"
                        variant="outlined"
                        control="search"
                        name="search"
                        label="Search"
                      />
                      <FiltersControls
                        control="select"
                        name="department"
                        label="Department"
                        labelId="departmentLabel"
                        options={departments}
                      />

                      {/* <FiltersControls control="order" />  */}
                    </Stack>
                    <Stack
                      direction={"row"}
                      width="100%"
                      alignSelf={"center"}
                      spacing={10}
                    >
                      <FiltersControls
                        control="select"
                        name="location"
                        label="Location"
                        labelId="locationLabel"
                        options={locations}
                      />
                      <FiltersControls
                        control="select"
                        name="language"
                        label="Language"
                        labelId="languageLabel"
                        options={languages}
                      />
                    </Stack>
                    <Stack
                      direction={"row"}
                      width="100%"
                      alignSelf={"center"}
                      spacing={10}
                    >
                      <FiltersControls
                        control="select"
                        name="material_type"
                        label="Material Type"
                        labelId="material_typeLabel"
                        options={material_types}
                      />
                      <FiltersControls
                        control="select"
                        name="orderBy"
                        label="Order By"
                        labelId="orderByLabel"
                        options={orderByArray}
                      />
                    </Stack>
                    <Stack
                      direction={"row"}
                      width="100%"
                      alignSelf={"center"}
                      spacing={10}
                    >
                      <FiltersControls control="order" />
                      <FiltersControls control="availability" />
                      {/* <FiltersControls
                        control="select"
                        name="availability"
                        label="Availability"
                        labelId="AvailabilityLabel"
                        options={Availability}
                      /> */}
                    </Stack>
                    <div className="flex justify-between p-4">
                      <div className="pt-8  justify-start">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formProps.values.newArrival === 1}
                            value=""
                            className="sr-only peer"
                            onChange={(e) =>
                              formProps.setFieldValue(
                                "newArrival",
                                e.target.checked ? 1 : 0
                              )
                            }
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            New Arrival
                          </span>
                        </label>
                      </div>

                      <Stack
                        direction={"row"}
                        spacing={2}
                        className="flex justify-end  pt-8"
                      >
                        <Button
                          size="small"
                          variant="contained"
                          className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:ring-slate-200 transition duration-300 ease-in-out transform hover:scale-110 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                          onClick={() => formProps.setValues(handleReset)}
                        >
                          RESET
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-200 font-bold transition duration-300 ease-in-out transform hover:scale-110 rounded-lg text-sm px-5 py-2.5 text-center w-24"
                          type="submit"
                        >
                          Apply
                        </Button>
                      </Stack>
                    </div>
                  </Stack>
                </Form>
              )}
            </Formik>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
}
export default BooksListFilters;

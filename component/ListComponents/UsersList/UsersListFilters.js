import { Formik, Form, Field } from "formik";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  Button,
  Select,
} from "@mui/material";
import fetchFilteredData from "./FilteredData";
import FiltersControls from "../../../component/Filters/FiltersControls";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function Filter(props) {
  const {
    searchParams,
    roles,
    departments,
    designations,
    setFilteredUsers,
    router,
    setCurrentPage,
  } = props;
  const initialValues = {
    search: searchParams?.get("search")?.toString() || "",
    roles: searchParams?.get("roles")?.toString() || "",
    department: searchParams?.get("department")?.toString() || "",
    designation: searchParams?.get("designation")?.toString() || "",
    status: searchParams?.get("status")?.toString() || "",
    orderBy: searchParams?.get("orderBy")?.toString() || "",
    order: searchParams?.get("order")?.toString() || "",
  };
  const handleReset = {
    search: "",
    roles: "",
    department: "",
    designation: "",
    status: "",
    orderBy: "",
    order: "",
  };

  const handleSubmit = async (values) => {
    const filteredData = await fetchFilteredData(
      values,
      searchParams,
      router.replace
    );
    setFilteredUsers(filteredData);
    setCurrentPage(1);
  };
  return (
    <>
      <h1 className="bg-white text-center text-sky-700 font-bold  text-2xl">
        Users List
      </h1>
      <div className="p-4 flex justify-center ">
        <Accordion className="w-full  md:w-[800px] lg:w-[1000px] ">
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className="font-bold text-lg">Filter</Typography>
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
                      spacing={5}
                    >
                      <FiltersControls
                        control="search"
                        name="search"
                        label="Search"
                        id="outlined-basic"
                        variant="outlined"
                      />

                      <FiltersControls
                        control="select"
                        name="department"
                        label="Department"
                        labelId="departmentLabel"
                        options={departments}
                      />
                    </Stack>
                    <Stack
                      direction={"row"}
                      width="100%"
                      alignSelf={"center"}
                      spacing={5}
                    >
                      <FiltersControls
                        control="select"
                        name="roles"
                        label="Roles"
                        labelId="rolesLabel"
                        options={roles}
                      />
                      <FiltersControls
                        control="select"
                        name="designation"
                        label="Designation"
                        labelId="designationLabel"
                        options={designations}
                      />
                    </Stack>
                    <Stack
                      direction={"row"}
                      width="100%"
                      alignSelf={"center"}
                      spacing={5}
                    >
                      <FiltersControls control="status" />
                      <FormControl fullWidth>
                        <InputLabel id="orderByLabel">Order By </InputLabel>
                        <Field
                          as={Select}
                          name="orderBy"
                          labelId="orderByLabel"
                          label="Order By"
                        >
                          <MenuItem value={null}>Select</MenuItem>
                          <MenuItem value="name">Name</MenuItem>
                          <MenuItem value="department">Department</MenuItem>
                        </Field>
                      </FormControl>
                    </Stack>
                    <Stack direction={"row"} spacing={1} width="48%">
                      <FiltersControls control="order" />
                    </Stack>
                    <Stack
                      direction={"row"}
                      spacing={2}
                      className=" flex justify-end px-32"
                    >
                      <Button
                        size="small"
                        variant="contained"
                        className="text-white bg-slate-600 hover:bg-slate-700  transition duration-300 ease-in-out transform hover:scale-110 focus:ring-4 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                        type="submit"
                        onClick={() => formProps.setValues(handleReset)}
                      >
                        RESET
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        className="text-white  bg-sky-700  transition duration-300 ease-in-out transform hover:scale-110 hover:bg-sky-800 focus:ring-4 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
                        type="submit"
                      >
                        APPLY
                      </Button>
                    </Stack>
                  </Stack>
                </Form>
              )}
            </Formik>

            <Stack spacing={2} direction={"row"}></Stack>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
}
export default Filter;

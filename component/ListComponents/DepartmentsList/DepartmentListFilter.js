import { Formik, Form, Field } from "formik";
import Link from "next/link";
import {
  Stack,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import * as Yup from "yup";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import fetchDepartmentFilteredData from "./DepartmentFilteredData";

import FiltersControls from "../../Filters/FiltersControls";
// const validationSchema = Yup.object({
//   search: Yup.string().required(" "),

//   orderBy: Yup.string().required(" "),

//   order: Yup.string().required(" "),
// });
function DepartmentFilter(props) {
  const { searchParams, setPagedata, router, setCurrentPage } = props;
  const initialValues = {
    search: searchParams?.get("search")?.toString() || "",
    order: searchParams?.get("order")?.toString() || "",
    orderBy: searchParams?.get("orderBy")?.toString() || "",
  };
  const handleReset = {
    search: "",
    order: "",
  };
  const handleSubmit = async (data) => {
    const filteredData = await fetchDepartmentFilteredData(
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
      {/* <Container className="bg-slate-50 shadow-md"> */}
      <h1 className="bg-white text-center text-sky-700 font-bold pb-4 text-2xl">
        Department List
      </h1>
      <div className="p-4  flex justify-center">
        <Accordion className="w-full  md:w-[800px] lg:w-[1000px] ">
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className="font-bold text-lg">Filter</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Formik
              initialValues={initialValues}
              // validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
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

                        // error={
                        //   formProps.touched.search && !!formProps.errors.search
                        // }
                        // helpertext={
                        //   formProps.touched.search && formProps.errors.search
                        // }
                      />
                      <FiltersControls
                        control="select"
                        name="orderBy"
                        label="Order By"
                        labelId="orderByLabel"
                        options={orderByArray}
                        // error={
                        //   formProps.touched.orderBy &&
                        //   !!formProps.errors.orderBy
                        // }
                        // helpertext={
                        //   formProps.touched.orderBy && formProps.errors.orderBy
                        // }
                      />
                    </Stack>
                    <Stack direction={"row"} spacing={1} width="46%">
                      <FiltersControls
                        control="order"
                        name="order"
                        label="Order"
                        labelId="orderLabel"
                        // error={
                        //   formProps.touched.order && !!formProps.errors.order
                        // }
                        // helpertext={
                        //   formProps.touched.order && formProps.errors.order
                        // }
                      />
                    </Stack>

                    <Stack
                      direction={"row"}
                      spacing={2}
                      className="flex justify-end px-32"
                    >
                      <Button
                        size="small"
                        variant="contained"
                        className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                        type="submit"
                        onClick={() => formProps.setValues(handleReset)}
                      >
                        RESET
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
                        type="submit"
                      >
                        Apply
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
      {/* </Container> */}
    </>
  );
}
export default DepartmentFilter;

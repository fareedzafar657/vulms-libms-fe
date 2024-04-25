import { Formik, Form, Field } from "formik";
import { Stack, Button } from "@mui/material";
import FiltersControls from "../../Filters/FiltersControls";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import fetchBorrowFilterData from "./BorrowFilterData";

function BorrowListFilter(props) {
  const { searchParams, setPagedata, router, setCurrentPage } = props;
  const initialValues = {
    search: searchParams.get("search")?.toString() || "",
    order: searchParams.get("order")?.toString() || "",
    orderBy: searchParams.get("orderBy")?.toString() || "",
  };
  const handleReset = {
    search: "",
    order: "",
  };
  const handleSubmit = async (data) => {
    const filteredData = await fetchBorrowFilterData(
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
      <h1 className="bg-white text-center text-sky-700 font-bold pb-4 text-2xl">
        Borrowed Assets list
      </h1>
      <div className="p-4  flex justify-center">
        <Accordion className="w-full md:w-[73vw]">
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
                      <FormControl fullWidth>
                        <InputLabel id="orderByLabel">Order By </InputLabel>
                        <Field
                          as={Select}
                          name="orderBy"
                          labelId="orderByLabel"
                          label="Order By"
                          options={orderByArray}
                        >
                          <MenuItem value={null}>Select</MenuItem>
                          <MenuItem value="name">Name</MenuItem>
                          <MenuItem value="department">Designation</MenuItem>
                        </Field>
                      </FormControl>
                    </Stack>
                    <Stack direction={"row"} spacing={1} width="46%">
                      <FiltersControls control="order" />
                    </Stack>
                    <Stack
                      direction={"row"}
                      spacing={2}
                      className="flex justify-end px-32"
                    >
                      <Button
                        onClick={() => formProps.setValues(handleReset)}
                        size="small"
                        variant="contained"
                        className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:ring-slate-200  transition duration-300 ease-in-out transform hover:scale-110 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                        type="submit"
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
export default BorrowListFilter;

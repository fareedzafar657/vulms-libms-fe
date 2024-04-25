import { Formik, Form } from "formik";
import { Stack, Button, Switch } from "@mui/material";
import FiltersControls from "../../Filters/FiltersControls";
import axios from "axios";
import Card from "@mui/material/Card";
import { Field, ErrorMessage, FieldArray } from "formik";
import { useState, useEffect } from "react";
import fetchAssetsFilteredData from "./assetsFilteredData";

function AssetsListFilters(props) {
  const {
    searchParams,
    setPagedata,
    router,
    setCurrentPage,
    material_types,
    languages,
    locations,
    departments,
    category,
  } = props;

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedMaterialType, setSelectedMaterialType] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedSortBy, setSelectedSortBy] = useState([]);
  const [selectedSort, setSelectedSort] = useState([]);

  const initialValues = {
    category: searchParams.get("category")?.toString() || "",
    search: searchParams.get("search")?.toString() || "",
    status: searchParams.get("status")?.toString() || "",
    orderBy: searchParams.get("orderBy")?.toString() || "",
    sort: searchParams.get("sortArray")?.toString() || "",
    location: searchParams.get("location")?.toString() || "",
    material_type: searchParams.get("material_type")?.toString() || "",
    language: searchParams.get("language")?.toString() || "",
    department: searchParams.get("department")?.toString() || "",
  };

  const handleChange = async (event) => {
    const { checked, value, name } = event.target;

    if (checked) {
      if (name === "category") {
        setSelectedCategory((prevCategory) => [...prevCategory, value]);
      } else if (name === "languages") {
        setSelectedLanguages((prevLanguages) => [...prevLanguages, value]);
      } else if (name === "location") {
        setSelectedLocation((prevLocation) => [...prevLocation, value]);
      } else if (name === "department") {
        setSelectedDepartment((prevDepartment) => [...prevDepartment, value]);
      } else if (name === "materialtype") {
        setSelectedMaterialType((prevMaterialType) => [
          ...prevMaterialType,
          value,
        ]);
      } else if (name === "status") {
        setSelectedStatus((prevStatus) => [...prevStatus, value]);
      } else if (name === "orderBy") {
        setSelectedSortBy((prevSortBy) => [...prevSortBy, value]);
      } else if (name === "sortarray") {
        setSelectedSort((prevSort) => [...prevSort, value]);
      }
    } else {
      if (name === "category") {
        setSelectedCategory((prevCategory) =>
          prevCategory.filter((category) => category !== value)
        );
      } else if (name === "languages") {
        setSelectedLanguages((prevLanguages) =>
          prevLanguages.filter((language) => language !== value)
        );
      } else if (name === "location") {
        setSelectedLocation((prevLocation) =>
          prevLocation.filter((location) => location !== value)
        );
      } else if (name === "department") {
        setSelectedDepartment((prevDepartment) =>
          prevDepartment.filter((department) => department !== value)
        );
      } else if (name === "materialtype") {
        setSelectedMaterialType((prevMaterialType) =>
          prevMaterialType.filter((materialtype) => materialtype !== value)
        );
      } else if (name === "status") {
        setSelectedStatus((prevStatus) =>
          prevStatus.filter((status) => status !== value)
        );
      } else if (name === "orderBy") {
        setSelectedSortBy((prevSortBy) =>
          prevSortBy.filter((orderBy) => orderBy !== value)
        );
      } else if (name === "sortArray") {
        setSelectedSort((prevSort) =>
          prevSort.filter((sortArray) => sortArray !== value)
        );
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const filteredData = await fetchAssetsFilteredData(
        {
          ...initialValues,
          category: selectedCategory.join(","),
          language: selectedLanguages.join(","),
          location: selectedLocation.join(","),
          department: selectedDepartment.join(","),
          materialType: selectedMaterialType.join(","),
          status: selectedStatus.join(","),
          sortBy: selectedSortBy.join(","),
          sort: selectedSort.join(","),
        },

        searchParams,
        router.replace
      );
      setPagedata(filteredData);
      setCurrentPage(1);
    };

    fetchData();
  }, [
    selectedCategory,
    selectedLanguages,
    selectedLocation,
    selectedDepartment,
    selectedMaterialType,
    selectedStatus,
    selectedSortBy,
    selectedSort,
  ]);

  const orderBy = [{ name: "Name" }];
  const sortArray = ["Ascending", "Descending"];
  const status = ["Issued", "Available", "New Arrival"];

  return (
    <>
      <div className="mb-40">
        <div className="p-4 flex justify-center  ">
          <Card className="w-100 h-100">
            <Formik initialValues={initialValues}>
              <div className="relative text-blue-700 overflow-hidden  ">
                <input
                  type="checkbox"
                  className="absolute peer top-0 inset-x-0 w-full h-12 z-10 cursor-pointer opacity-0"
                />
                <div className="h-12 w-full pl-5 flex items-center">
                  <h1 className="text-lg font-bold text-black">Search</h1>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="text-black w-80 ml-12 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
                <div className="text-blue-700 overflow-hidden transition-all duration-500 max-h-0 peer-checked:max-h-40">
                  ..
                </div>
                <FiltersControls
                  id="outlined-basic"
                  variant="outlined"
                  control="search"
                  name="search"
                  label="Search"
                />
              </div>
            </Formik>

            <hr className="my-4 border-t border-gray-300" />
            <div className="relative text-blue-700 overflow-hidden m-4 ">
              <input
                type="checkbox"
                className="absolute peer  top-0 inset-x-0 w-full h-12 z-10 cursor-pointer opacity-0"
              />
              <div className="h-12 w-full pl-5 flex items-center">
                <h1 className="text-lg font-bold text-black">Categories</h1>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="text-black w-80 ml-4 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
              {category.map((category) => {
                return (
                  <>
                    <div
                      key={category.name}
                      className="text-blue-700 overflow-hidden transition-all duration-500 max-h-0 peer-checked:max-h-40"
                    >
                      <input
                        id={category.name}
                        name="category"
                        value={category.name}
                        type="checkbox"
                        className="h-4 w-4  rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={handleChange}
                        checked={selectedCategory.includes(category.name)}
                      />

                      <label
                        htmlFor={category.name}
                        className=" p-4 text-sm text-gray-600"
                      >
                        {category.name}
                      </label>
                    </div>
                  </>
                );
              })}

              <hr className="my-4 border-t border-gray-300" />
            </div>
            <div className="relative text-blue-700 overflow-hidden m-4 ">
              <input
                type="checkbox"
                className="absolute peer top-0 inset-x-0 w-full h-12 z-10 cursor-pointer opacity-0"
              />
              <div className="h-12 w-full pl-5 flex items-center">
                <h1 className="text-lg font-bold text-black">Languages</h1>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="text-black w-80 ml-4 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
              {languages.map((languages) => {
                return (
                  <>
                    <div
                      key={languages.name}
                      className="text-blue-700 overflow-hidden transition-all duration-500 max-h-0 peer-checked:max-h-40"
                    >
                      <input
                        id={languages.name}
                        name="languages"
                        value={languages.name}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={handleChange}
                        checked={selectedLanguages.includes(languages.name)}
                      />
                      <label
                        htmlFor={languages.name}
                        className="mb-3 p-4 text-sm text-gray-600"
                      >
                        {languages.name}
                      </label>
                    </div>
                  </>
                );
              })}

              <hr className="my-4 border-t border-gray-300" />
            </div>
            <div className="relative text-blue-700 overflow-hidden m-4">
              <input
                type="checkbox"
                className="absolute peer top-0 inset-x-0 w-full h-12 z-10 cursor-pointer opacity-0"
              />
              <div className="h-12 w-full pl-5 flex items-center">
                <h1 className="text-lg font-bold text-black">Libraries</h1>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="text-black w-80 ml-10 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
              {locations.map((location) => {
                return (
                  <>
                    <div
                      key={location.name}
                      className="text-blue-700 overflow-hidden transition-all duration-500 max-h-0 peer-checked:max-h-40"
                    >
                      <input
                        id={location.name}
                        name="location"
                        value={location.name}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={handleChange}
                        checked={selectedLocation.includes(location.name)}
                      />
                      <label
                        htmlFor={location.name}
                        className="mb-3 p-4 text-sm text-gray-600"
                      >
                        {location.name}
                      </label>
                    </div>
                  </>
                );
              })}

              <hr className="my-4 border-t border-gray-300" />
            </div>
            <div className="relative text-blue-700 overflow-hidden m-4 ">
              <input
                type="checkbox"
                className="absolute peer top-0 inset-x-0 w-full h-12 z-10 cursor-pointer opacity-0"
              />
              <div className="h-12 w-full pl-5 flex items-center">
                <h1 className="text-lg font-bold text-black">Department</h1>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="text-black w-80 ml-4 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
              {departments.map((department) => {
                return (
                  <>
                    <div
                      key={department.name}
                      className="text-blue-700 overflow-hidden transition-all duration-500 max-h-0 peer-checked:max-h-40"
                    >
                      <input
                        id={department.name}
                        name="department"
                        value={department.name}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={handleChange}
                        checked={selectedDepartment.includes(department.name)}
                      />

                      <label
                        htmlFor={department.name}
                        className="mb-3 p-4 text-sm text-gray-600"
                      >
                        {department.name}
                      </label>
                    </div>
                  </>
                );
              })}

              <hr className="my-4 border-t border-gray-300" />
            </div>
            <div className="relative text-blue-700 overflow-hidden m-4 ">
              <input
                type="checkbox"
                className="absolute peer top-0 inset-x-0 w-full h-12 z-10 cursor-pointer opacity-0"
              />
              <div className="h-12 w-full pl-5 flex items-center">
                <h1 className="text-lg font-bold text-black">MaterialType</h1>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="text-black w-80 ml-2 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
              {material_types.map((materialtype) => {
                return (
                  <>
                    <div
                      key={materialtype.name}
                      className="text-blue-700 overflow-hidden transition-all duration-500 max-h-0 peer-checked:max-h-40"
                    >
                      <input
                        id={materialtype.name}
                        name="materialtype"
                        value={materialtype.name}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={handleChange}
                        checked={selectedMaterialType.includes(
                          materialtype.name
                        )}
                      />
                      <label
                        htmlFor={materialtype.name}
                        className="mb-3 p-4 text-sm text-gray-600"
                      >
                        {materialtype.name}
                      </label>
                    </div>
                  </>
                );
              })}

              <hr className="my-4 border-t border-gray-300" />
            </div>
            <div className="relative text-blue-700 overflow-hidden m-4 ">
              <input
                type="checkbox"
                className="absolute peer top-0 inset-x-0 w-full h-12 z-10 cursor-pointer opacity-0"
              />
              <div className="h-12 w-full pl-5 flex items-center">
                <h1 className="text-lg font-bold text-black">Status</h1>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="text-black w-80 ml-16 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
              {status.map((status) => {
                return (
                  <>
                    <div
                      key={status}
                      className="text-blue-700 overflow-hidden transition-all duration-500 max-h-0 peer-checked:max-h-40"
                    >
                      <input
                        id={status}
                        name="status"
                        value={status}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={handleChange}
                        checked={selectedStatus.includes(status)}
                      />
                      <label
                        htmlFor={status}
                        className="mb-3 p-4 text-sm text-gray-600"
                      >
                        {status}
                      </label>
                    </div>
                  </>
                );
              })}

              <hr className="my-4 border-t border-gray-300" />
            </div>
            <div className="relative text-blue-700 overflow-hidden m-4">
              <input
                type="checkbox"
                className="absolute peer top-0 inset-x-0 w-full h-12 z-10 cursor-pointer opacity-0"
              />
              <div className="h-12 w-full pl-5 flex items-center">
                <h1 className="text-lg font-bold text-black">SortBy</h1>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="text-black w-80 ml-14 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
              {orderBy.map((orderBy) => {
                return (
                  <>
                    <div
                      key={orderBy.name}
                      className="text-blue-700 overflow-hidden transition-all duration-500 max-h-0 peer-checked:max-h-40"
                    >
                      <input
                        id={orderBy.name}
                        name="orderBy"
                        value={orderBy.name}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={handleChange}
                        checked={selectedSortBy.includes(orderBy.name)}
                      />
                      <label
                        htmlFor={orderBy.name}
                        className="mb-3 p-4 text-sm text-gray-600"
                      >
                        {orderBy.name}
                      </label>
                    </div>
                  </>
                );
              })}

              <hr className="my-4 border-t border-gray-300" />
            </div>
            <div className="relative text-blue-700 overflow-hidden m-4 ">
              <input
                type="checkbox"
                className="absolute peer top-0 inset-x-0 w-full h-12 z-10 cursor-pointer opacity-0"
              />
              <div className="h-12 w-full pl-5 flex items-center">
                <h1 className="text-lg font-bold text-black">Sort</h1>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="text-black w-80 ml-20 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
              {sortArray.map((sortArray) => {
                return (
                  <>
                    <div
                      key={sortArray}
                      className="text-blue-700 overflow-hidden transition-all duration-500 max-h-0 peer-checked:max-h-40"
                    >
                      <input
                        id={sortArray}
                        name="sortarray"
                        value={sortArray}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={handleChange}
                        checked={selectedSort.includes(sortArray)}
                      />
                      <label
                        htmlFor={sortArray}
                        className="mb-3 p-4 text-sm text-gray-600"
                      >
                        {sortArray}
                      </label>
                    </div>
                  </>
                );
              })}

              <hr className="my-4 border-t border-gray-300" />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
export default AssetsListFilters;

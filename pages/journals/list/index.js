import React from "react";
import axios from "axios";
import { useState } from "react";
import { Button, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import DeleteButton from "../../../component/common/DeleteButton";
import EditButton from "../../../component/common/EditButton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
} from "@mui/material";
import FiltersControls from "../../../component/Filters/FiltersControls";
import Layoutt from "../../../component/lay/Layoutt";
import fetchJournalsFilteredData from "../../../component/ListComponents/JournalsList/journalsFilteredData";

import VisibilityIcon from "@mui/icons-material/Visibility";
import JournalsListFilters from "../../../component/ListComponents/JournalsList/journalsListFilters";
import { getSession } from "next-auth/react";
import { Tooltip } from "@mui/material";
export async function getServerSideProps(context) {
  const data = context.query;
  const session = await getSession(context);
  const params = new URLSearchParams();

  if (data.search) {
    params.set("search", data.search);
  }
  if (data.take) {
    params.set("take", data.take);
  }
  if (data.page) {
    params.set("page", data.page);
  }
  if (data.order) {
    params.set("order", data.order);
  }
  if (data.orderBy) {
    params.set("orderBy", data.orderBy);
  }
  if (data.location) {
    params.set("location", data.location);
  }
  if (data.material_type) {
    params.set("material_type", data.material_type);
  }
  if (data.language) {
    params.set("language", data.language);
  }
  if (data.availability) {
    params.set("status", data.availability);
  }
  if (data.newArrival) {
    params.set("newArrival", data.newArrival);
  }

  try {
    const res = await axios.get(`/journals/pagedata${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
      },
    });
    const getData = res.data;

    return {
      props: {
        records: getData.pagedata || [],
        publishers: getData.publishers || [],
        issn_no: getData.issn_no || [],

        material_types: getData.material_types || [],
        languages: getData.languages || [""],
        locations: getData.locations || [],
        authors: getData.authors || [],
        availability: getData.availability || [],
      },
    };
  } catch (error) {
    console.error("Failed to fetch Data.", error);
  }
}

function journals({
  records,
  publishers,

  issn_no,
  material_types,
  languages,
  locations,
  authors,
}) {
  const [pagedata, setPagedata] = useState(records);
  const [currentPage, setCurrentPage] = useState(pagedata.meta.page);
  const currentTake = pagedata.meta.take;
  const searchParams = useSearchParams();
  const router = useRouter();

  let SrNo = 1;
  return (
    <Layoutt>
      <div className="relative bg-white border border-gray-300 pt-6 p-4  shadow-xl mx-auto min-w-full rounded-md  overflow-x-auto">
        <JournalsListFilters
          setPagedata={setPagedata}
          searchParams={searchParams}
          router={router}
          setCurrentPage={setCurrentPage}
          publishers={publishers}
          issn_no={issn_no}
          material_types={material_types}
          languages={languages}
          locations={locations}
          authors={authors}
        />
        {/* <div className="flex justify-end md:mr-1 lg:mr-28 p-4">
          <Link href="/journals/createjournals" underline="none">
            <button className="flex items-center gap-1 bg-sky-700 text-white py-2 px-4 rounded-md hover:bg-sky-800 transition duration-300 ease-in-out transform hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m6-6H6"
                />
              </svg>
              ADD
            </button>
          </Link>
        </div> */}
        <div className="mx-auto w-full md:w-[800px] lg:w-[1000px]">
          <div className="flex justify-end  p-4 w-full ">
            <Stack direction={"row"} spacing={2}>
              <Link href="/journals/createjournals" underline="none">
                <Button
                  size="small"
                  variant="contained"
                  className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-200 font-bold transition duration-300 ease-in-out transform hover:scale-110 rounded-lg text-sm px-5 py-2.5 text-center w-24"
                  type="submit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                  Add
                </Button>
              </Link>
            </Stack>
          </div>
          <Stack>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow className="bg-sky-600 border-b ">
                    <TableCell className=" font-bold text-white" align="left">
                      #
                    </TableCell>

                    <TableCell className=" font-bold text-white" align="center">
                      Title
                    </TableCell>

                    <TableCell className=" font-bold text-white" align="left">
                      Location
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="left">
                      Material Type
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="left">
                      Language
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="left">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedata.data.map((journals) => {
                    return (
                      <TableRow
                        className="text-black odd:bg-[#FFFFFF] even:bg-sky-100 border-b"
                        key={journals?.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{SrNo++}</TableCell>
                        <TableCell align="center">
                          <ul>
                            <li className="flex">
                              {journals.is_available ? (
                                <Tooltip title="Available" arrow>
                                  <div className="text-green-500 transform hover:scale-110">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="w-6 h-6"
                                    >
                                      <circle
                                        cx="12"
                                        cy="12"
                                        r="5"
                                        fill="green"
                                      />
                                    </svg>
                                  </div>
                                </Tooltip>
                              ) : (
                                <Tooltip title="issued" arrow>
                                  <div className="text-red-500 transform hover:scale-110">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="w-6 h-6"
                                    >
                                      <circle
                                        cx="12"
                                        cy="12"
                                        r="5"
                                        fill="red"
                                      />
                                    </svg>
                                  </div>
                                </Tooltip>
                              )}
                              {journals?.title}
                            </li>

                            <li className="text-sky-500 text-left ">
                              {journals?.volume_no}
                            </li>
                            <li className="text-sky-500 text-left">
                              {journals?.issn_no}
                            </li>
                            <li className="text-red-500 text-left ">
                              {journals?.publisher.name}
                            </li>
                          </ul>
                        </TableCell>
                        <TableCell align="left">
                          {journals?.location?.name}
                        </TableCell>
                        <TableCell align="left">
                          {journals?.material_type?.name}
                        </TableCell>
                        <TableCell align="left">
                          {journals?.language?.name}
                        </TableCell>

                        <TableCell align="left" className="py-4">
                          <Stack direction={"row"}>
                            <div className="text-sky-600 transition duration-300 ease-in-out transform hover:scale-110">
                              {/* <VisibilityIcon link="/magazines/magazinedetail" /> */}
                              <a href={`/journals/detail/${journals.id}`}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </a>
                            </div>
                            <EditButton
                              className="p-8"
                              link={`/journals/update/${journals.id}`}
                              router={router}
                            />
                            <DeleteButton
                              link={`/journals/delete/${journals.id}`}
                              router={router}
                              category="journal"
                            />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
          <div className="flex flex-col md:flex-row md:justify-between p-4">
            <Stack spacing={2} className="ml-0 md:ml-4">
              <FiltersControls
                control="take"
                setPagedata={setPagedata}
                filteringData={fetchJournalsFilteredData}
                currentTake={currentTake}
                searchParams={searchParams}
                replace={router.replace}
              />
            </Stack>
            <Stack spacing={2} className="ml-0 md:ml-24">
              <FiltersControls
                control="page"
                pagination={pagedata.meta}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setPagedata={setPagedata}
                searchParams={searchParams}
                replace={router.replace}
                filteringData={fetchJournalsFilteredData}
              />
            </Stack>
          </div>
        </div>
      </div>
    </Layoutt>
  );
}

export default journals;

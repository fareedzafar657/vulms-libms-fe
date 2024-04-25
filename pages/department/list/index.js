import React, { useState, useEffect } from "react";
import DeleteButton from "../../../component/common/DeleteButton";
import EditButton from "../../../component/common/EditButton";
import { useSearchParams } from "next/navigation";
import Layoutt from "../../../component/lay/Layoutt";
import { useRouter } from "next/router";
import { Button, Stack, TextField } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { getSession } from "next-auth/react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import fetchDepartmentFilteredData from "../../../component/ListComponents/DepartmentsList/DepartmentFilteredData";
import FiltersControls from "../../../component/Filters/FiltersControls";
import DepartmentFilter from "../../../component/ListComponents/DepartmentsList/DepartmentListFilter";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const data = context.query;

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
  if (data.order) {
    params.set("orderBy", data.order);
  }
  try {
    const res = await axios.get(`/departments/pagedata?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
      },
    });
    const pagedata = res.data;
    return {
      props: {
        records: pagedata,
      },
    };
  } catch (error) {
    console.error("Failed to fetch Data.", error);
  }
}

function departments({ records }) {
  const [pagedata, setPagedata] = useState(records);
  const [currentPage, setCurrentPage] = useState(pagedata.meta.page);
  const currentTake = pagedata.meta.take;
  const searchParams = useSearchParams();
  const router = useRouter();
  let SrNo = 1;

  return (
    <>
      <Layoutt>
        <div className="relative bg-white border border-gray-300 pt-6 pb-6 p-4 shadow-xl 3xl:w-[1920px]  mx-auto min-w-full rounded-md overflow-x-auto">
          <DepartmentFilter
            setPagedata={setPagedata}
            searchParams={searchParams}
            router={router}
            setCurrentPage={setCurrentPage}
          />
          <Stack>
            <div className="mx-auto w-full md:w-[800px] lg:w-[1000px]">
              <div className="flex justify-end  p-4 w-full ">
                <Stack direction={"row"} spacing={2}>
                  <Link href="/department/createdepartment" underline="none">
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
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow className="bg-sky-600 border-b ">
                      <TableCell
                        className=" font-bold text-white"
                        align="center"
                      >
                        Sr#
                      </TableCell>
                      <TableCell
                        className=" font-bold text-white"
                        align="center"
                      >
                        Name
                      </TableCell>
                      <TableCell className=" font-bold text-white" align="left">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pagedata.data.map((departments) => {
                      return (
                        <TableRow
                          className="text-black odd:bg-[#FFFFFF] even:bg-sky-200  border-b"
                          key={departments.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="center">{SrNo++}</TableCell>
                          <TableCell align="center">
                            {departments.name}
                          </TableCell>
                          <TableCell align="left">
                            <Stack direction={"row"}>
                              <EditButton
                                link={`/department/${departments.id}`}
                                router={router}
                              />

                              <DeleteButton
                                link={`/departments/delete/${departments.id}`}
                                category="department"
                              />
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className="flex  md:justify-between p-4">
                <Stack container spacing={2} className=" md:mr-34">
                  <FiltersControls
                    control="take"
                    setPagedata={setPagedata}
                    filteringData={fetchDepartmentFilteredData}
                    currentTake={currentTake}
                    searchParams={searchParams}
                    replace={router.replace}
                  />
                </Stack>
                <Stack spacing={4} className="ml-0 md:ml-28">
                  <FiltersControls
                    control="page"
                    pagination={pagedata.meta}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    setPagedata={setPagedata}
                    searchParams={searchParams}
                    replace={router.replace}
                    filteringData={fetchDepartmentFilteredData}
                  />
                </Stack>
              </div>
            </div>
          </Stack>
        </div>
      </Layoutt>
    </>
  );
}

export default departments;

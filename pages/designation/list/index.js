import React from "react";
import axios from "axios";
import { useState } from "react";
import { Button, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
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
import Layoutt from "../../../component/lay/Layoutt";
import DeleteButton from "../../../component/common/DeleteButton";
import EditButton from "../../../component/common/EditButton";

import FiltersControls from "../../../component/Filters/FiltersControls";
import fetchDesignationFilterData from "../../../component/ListComponents/DesignationsList/DesignationFilterData";
import DesignationFilter from "../../../component/ListComponents/DesignationsList/DesignationListFilter";
import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const data = context.query;

  const params = new URLSearchParams();

  if (data.search) {
    params.set("search", data.search);
  }
  if (data.status) {
    params.set("status", data.status);
  }
  if (data.designation) {
    params.set("designation", data.designation);
  }
  if (data.take) {
    params.set("take", data.take);
  }
  if (data.page) {
    params.set("page", data.page);
  }
  if (data.orderBy) {
    params.set("orderBy", data.orderBy);
  }
  if (data.order) {
    params.set("order", data.order);
  }

  try {
    const res = await axios.get(`/designations/pagedata?${params.toString()}`, {
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

function designations({ records }) {
  const [pagedata, setPagedata] = useState(records);
  const [currentPage, setCurrentPage] = useState(pagedata.meta.page);
  const currentTake = pagedata.meta.take;
  const searchParams = useSearchParams();
  const router = useRouter();
  let SrNo = 1;
  return (
    <Layoutt>
      <div className="relative bg-white border border-gray-300 pt-6 pb-6 shadow-xl 3xl:w-[1920px] p-4 mx-auto min-w-full rounded-md overflow-x-auto">
        <DesignationFilter
          setPagedata={setPagedata}
          searchParams={searchParams}
          router={router}
          setCurrentPage={setCurrentPage}
        />
        {/* <div className="flex justify-end md:mr-36 p-4">
          <Link href="/designation/createdesignation" underline="none">
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
        <Stack>
          <div className="mx-auto w-full md:w-[800px] lg:w-[1000px]">
            <div className="flex justify-end  p-4 w-full ">
              <Stack direction={"row"} spacing={2}>
                <Link href="/designation/createdesignation" underline="none">
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
                    <TableCell className=" font-bold text-white" align="center">
                      Sr#
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Name
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="left">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedata.data.map((designation) => {
                    return (
                      <TableRow
                        className="text-black odd:bg-[#FFFFFF] even:bg-sky-100  border-b"
                        key={designation.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{SrNo++}</TableCell>
                        <TableCell align="center">{designation.name}</TableCell>

                        <TableCell align="left">
                          <Stack direction={"row"}>
                            <EditButton
                              link={`/designation/${designation.id}`}
                              router={router}
                            />

                            <DeleteButton
                              link={`/designations/delete/${designation.id}`}
                              category="designation"
                            />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="flex md:justify-between p-4">
              <Stack spacing={2} className=" md:mr-34">
                <FiltersControls
                  control="take"
                  setPagedata={setPagedata}
                  filteringData={fetchDesignationFilterData}
                  currentTake={currentTake}
                  searchParams={searchParams}
                  replace={router.replace}
                />
              </Stack>
              <Stack spacing={2} className="ml-0 md:ml-28">
                <FiltersControls
                  control="page"
                  pagination={pagedata.meta}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  setPagedata={setPagedata}
                  searchParams={searchParams}
                  replace={router.replace}
                  filteringData={fetchDesignationFilterData}
                />
              </Stack>
            </div>
          </div>
        </Stack>
      </div>
    </Layoutt>
  );
}

export default designations;

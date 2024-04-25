import React, { useState, useEffect } from "react";
import DeleteButton from "../../../component/common/DeleteButton";
import EditButton from "../../../component/common/EditButton";
import { useSearchParams } from "next/navigation";
import Layoutt from "../../../component/lay/Layoutt";

import { useRouter } from "next/router";
import { Button, Stack, TextField } from "@mui/material";
import axios from "axios";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import fetchMaterialtypeFilteredData from "../../../component/ListComponents/MaterialTypesList/mattypeFilteredData";
import FiltersControls from "../../../component/Filters/FiltersControls";
import MaterialFilter from "../../../component/ListComponents/MaterialTypesList/materialListFilter";
import { getSession } from "next-auth/react";

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
  if (data.order) {
    params.set("orderBy", data.order);
  }
  try {
    const res = await axios.get(
      `/materialtypes/pagedata?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${session?.user.access_token}`,
        },
      }
    );
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
function materialtype({ records }) {
  const [pagedata, setPagedata] = useState(records);
  const [currentPage, setCurrentPage] = useState(pagedata.meta.page);
  const currentTake = pagedata.meta.take;
  const searchParams = useSearchParams();
  const router = useRouter();
  let SrNo = 1;

  return (
    <>
      <Layoutt>
        <div className="relative bg-white border border-gray-300 pt-6 p-4    shadow-xl mx-auto min-w-full 3xl:w-[1920px]  rounded-md overflow-x-auto">
          <MaterialFilter
            setPagedata={setPagedata}
            searchParams={searchParams}
            router={router}
            setCurrentPage={setCurrentPage}
          />
          {/* <div className="flex justify-end md:mr-28 p-4">
            <Link href="/materialtype/creatematerialtype">
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
                  <Link
                    href="/materialtype/creatematerialtype"
                    underline="none"
                  >
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
                    {pagedata.data.map((materialtype) => {
                      return (
                        <TableRow
                          className="text-black odd:bg-[#FFFFFF] even:bg-sky-200  border-b"
                          key={materialtype.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="center">{SrNo++}</TableCell>
                          <TableCell align="center">
                            {materialtype.name}
                          </TableCell>
                          <TableCell align="left">
                            <Stack direction={"row"}>
                              <EditButton
                                link={`/materialtype/${materialtype.id}`}
                                router={router}
                              />

                              <DeleteButton
                                link={`/materialtypes/delete/${materialtype.id}`}
                                category="material type"
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
                <Stack container spacing={2} className=" md:mr-34">
                  <FiltersControls
                    control="take"
                    setPagedata={setPagedata}
                    filteringData={fetchMaterialtypeFilteredData}
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
                    filteringData={fetchMaterialtypeFilteredData}
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

export default materialtype;

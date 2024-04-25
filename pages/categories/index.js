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
} from "@mui/material";
import FiltersControls from "../../component/Filters/FiltersControls";
import Layoutt from "../../component/lay/Layoutt";
import fetchcategoryFilteredData from "../../component/ListComponents/CategoriesList/categoryFilteredData";
import { getSession } from "next-auth/react";
export async function getServerSideProps(context) {
  const data = context.query;

  const params = new URLSearchParams();

  if (data.take) {
    params.set("take", data.take);
  }
  if (data.page) {
    params.set("page", data.page);
  }

  try {
    const session = await getSession(context);

    const res = await axios.get(`/categories/pagedata?${params.toString()}`, {
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

function category({ records }) {
  const [pagedata, setPagedata] = useState(records);
  const [currentPage, setCurrentPage] = useState(pagedata.meta.page);
  const currentTake = pagedata.meta.take;
  const searchParams = useSearchParams();
  const router = useRouter();

  let SrNo = 1;
  return (
    <Layoutt>
      <div className="relative bg-white border border-gray-300 pt-6 pb-6 shadow-xl 3xl:w-[1920px] p-4 mx-auto min-w-full rounded-md overflow-x-auto">
        <h1 className="text-center text-sky-700 font-bold pb-8 text-lg md:text-2xl">
          Categories List
        </h1>

        <div className="mx-auto w-full md:w-[800px] lg:w-[1000px]">
          <Stack>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow className="bg-sky-600 border-b ">
                    <TableCell className=" font-bold text-white" align="center">
                      No.
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Name
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedata.data.map((categories) => {
                    return (
                      <TableRow
                        className="text-black odd:bg-[#FFFFFF] even:bg-sky-100 border-b"
                        key={categories.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{SrNo++}</TableCell>
                        <TableCell align="center">{categories.name}</TableCell>
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
                filteringData={fetchcategoryFilteredData}
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
                filteringData={fetchcategoryFilteredData}
              />
            </Stack>
          </div>
        </div>
      </div>
    </Layoutt>
  );
}

export default category;

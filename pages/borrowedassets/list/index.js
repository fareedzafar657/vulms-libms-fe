import React from "react";
import Layoutt from "../../../component/lay/Layoutt";
import axios from "axios";
import { useState } from "react";
import { Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
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

import BorrowListFilter from "../../../component/ListComponents/BorrowedAssetsList/BorrowListFilter";
import fetchBorrowFilterData from "../../../component/ListComponents/BorrowedAssetsList/BorrowFilterData";
import FiltersControls from "../../../component/Filters/FiltersControls";

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

  try {
    const res = await axios.get(
      `/assets/borrowedAssetsList?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${session?.user.access_token}`,
        },
      }
    );
    const getData = res.data;
    return {
      props: {
        records: getData,
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.message || "Failed to fetch data",
      },
    };
  }
}

function borrowedassets({ records, error }) {
  const [pagedata, setPagedata] = useState(records);
  const [currentPage, setCurrentPage] = useState(pagedata.meta.page);
  const currentTake = pagedata.meta.take;
  const searchParams = useSearchParams();
  const router = useRouter();
  let SrNo = 1;
  if (error) {
    useEffect(() => {
      if (error) {
        return Swal.fire({
          text: error,
          icon: "error",
        }).then(() => {
          router.push("/_denied.js");
        });
      }
    }, [error]);
  }

  return (
    <Layoutt>
      <div className="relative bg-white border border-gray-300 pt-6 pb-10  shadow-xl mx-auto min-w-full rounded-md overflow-x-auto">
        <BorrowListFilter
          setPagedata={setPagedata}
          searchParams={searchParams}
          router={router}
          setCurrentPage={setCurrentPage}
          // publishers={publishers}
          // distributers={distributers}
          // material_types={material_types}
          // languages={languages}
          // locations={locations}
          // authors={authors}
          // departments={departments}
        />
        <div className="mx-auto w-full md:w-[800px] lg:w-[1000px]">
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow className="bg-sky-600 border-b ">
                  <TableCell className=" font-bold text-white" align="left">
                    #
                  </TableCell>
                  <TableCell className=" font-bold text-white" align="left">
                    Title
                  </TableCell>
                  <TableCell className=" font-bold text-white" align="left">
                    Borrower
                  </TableCell>
                  <TableCell className=" font-bold text-white" align="left">
                    Due Date
                  </TableCell>
                  <TableCell className=" font-bold text-white" align="left">
                    Re Due Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedata.data.map((asset) => (
                  <TableRow
                    className="text-black odd:bg-[#FFFFFF] even:bg-sky-100 border-b"
                    key={asset.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell className="px-4 py-1 text-sm" align="left">
                      {SrNo++}
                    </TableCell>
                    <TableCell>
                      <ul>
                        <li>{asset.issued_asset.title}</li>
                        <li className="text-red-500">
                          {asset.issued_asset.authors}
                        </li>
                        <li className="text-red-500">
                          {asset.issued_asset.publisher.name}
                        </li>
                        <li className="text-red-500">
                          {asset.issued_asset.category.name}
                        </li>
                        <li className="text-slate-700">
                          {asset.issued_asset.isbn_no}
                        </li>
                      </ul>
                    </TableCell>
                    <TableCell>
                      <ul>
                        <li>{asset.borrower.name}</li>
                        <li className="text-red-500">
                          {asset.borrower.department.name}
                        </li>
                        <li className="text-slate-700">
                          {asset.borrower.employee_id}
                        </li>
                      </ul>
                    </TableCell>
                    <TableCell align="left">{asset.due_date}</TableCell>
                    <TableCell align="left">{asset.re_due_date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between">
              <div className="ml-10">
                No. of records found {pagedata?.meta.itemCount}
                {console.log(pagedata.meta.pageCount)}
              </div>
              <div className="mr-10">
                No. of pages {pagedata.meta.pageCount}
              </div>
            </div>
          </TableContainer>
        </div>
        <div className="flex justify-between p-4">
          <Stack spacing={2} className="md:ml-36">
            <FiltersControls
              control="take"
              setPagedata={setPagedata}
              filteringData={fetchBorrowFilterData}
              currentTake={currentTake}
              searchParams={searchParams}
              replace={router.replace}
            />
          </Stack>
          <Stack spacing={4} className="md:mr-36">
            <FiltersControls
              control="page"
              pagination={pagedata.meta}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              setPagedata={setPagedata}
              searchParams={searchParams}
              replace={router.replace}
              filteringData={fetchBorrowFilterData}
            />
          </Stack>
        </div>
      </div>
    </Layoutt>
  );
}

export default borrowedassets;

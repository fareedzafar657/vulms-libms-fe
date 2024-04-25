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
import fetchReturnFilterData from "../../../component/ListComponents/ReturnedAssetsList/ReturnFilterData";
import FiltersControls from "../../../component/Filters/FiltersControls";
import ReturnListfilter from "../../../component/ListComponents/ReturnedAssetsList/ReturnListFilter";

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
      `/assets/returnedAssetsList?${params.toString()}`,
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
        publishers: getData,
        distributers: getData,
        material_types: getData,
        languages: getData,
        locations: getData,
        authors: getData,
        departments: getData,
      },
    };
  } catch (error) {
    console.error("Failed to fetch Data.", error);
  }
}

function assetslist({
  records,
  publishers,
  distributers,
  material_types,
  languages,
  locations,
  authors,
  departments,
}) {
  const [pagedata, setPagedata] = useState(records);
  const [currentPage, setCurrentPage] = useState(pagedata.meta.page);
  const currentTake = pagedata.meta.take;
  const searchParams = useSearchParams();
  const router = useRouter();

  let SrNo = 1;

  return (
    <Layoutt>
      <div className="relative bg-white border border-gray-300 pt-6 pb-10  shadow-xl mx-auto min-w-full rounded-md overflow-x-auto">
        <ReturnListfilter
          setPagedata={setPagedata}
          searchParams={searchParams}
          router={router}
          setCurrentPage={setCurrentPage}
          publishers={publishers}
          distributers={distributers}
          material_types={material_types}
          languages={languages}
          locations={locations}
          authors={authors}
          departments={departments}
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
                  <TableCell className=" font-bold text-white" align="left">
                    Return Date
                  </TableCell>
                  <TableCell className=" font-bold text-white" align="left">
                    Fine
                  </TableCell>
                  <TableCell className=" font-bold text-white" align="left">
                    Description
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
                        <li>{asset.title}</li>
                        <li className="text-red-500">{asset.author}</li>
                        <li className="text-red-500">{asset.name}</li>
                        <li className="text-red-500">{asset.isbn_no}</li>
                        <li className="text-slate-700">{asset.publishers}</li>
                      </ul>
                    </TableCell>
                    <TableCell>
                      <ul>
                        <li>{asset.name}</li>
                        <li>{asset.employee_id}</li>
                        <li className="text-red-500">{asset.departments}</li>
                      </ul>
                    </TableCell>

                    <TableCell align="left">{asset.due_date}</TableCell>
                    <TableCell align="left">{asset.re_due_date}</TableCell>
                    <TableCell align="left">{asset.return_date}</TableCell>
                    <TableCell align="left">{asset.fine_amount}</TableCell>
                    <TableCell align="left">
                      {asset.remarks_on_return_condition}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between">
              <div className="ml-10">
                No. of records found {pagedata.meta.itemCount}
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
              filteringData={fetchReturnFilterData}
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
              filteringData={fetchReturnFilterData}
            />
          </Stack>
        </div>
      </div>
    </Layoutt>
  );
}

export default assetslist;

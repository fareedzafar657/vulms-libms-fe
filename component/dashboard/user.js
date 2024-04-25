import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Link,
  Button,
  Stack,
} from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import Layoutt from "../lay/Layoutt";
import { getSession } from "next-auth/react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CarouselComponent from "./carousel";
import { useRouter } from "next/router";

function Dashboard() {
  const [currentissued, setCurrentissued] = useState([]);
  const [currentreIssued, setCurrentreIssued] = useState([]);
  const [history, setHistory] = useState([]);
  const [dataCounts, setdataCounts] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const api = async () => {
      const session = await getSession();

      axios
        .get("/assets/borrowerDashboard", {
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
          },
        })
        .then((res) => {
          const { issued, reIssued, returned, dataCounts } = res.data;
          setCurrentissued(issued),
            setCurrentreIssued(reIssued),
            setHistory(returned);
          setdataCounts(dataCounts);
        })
        .catch((err) => console.error(err));
    };
    api();
  }, []);
  let SrNo1 = 1;
  let SrNo2 = 1;
  let SrNo3 = 1;
  return (
    <div className="bg-white   border-4 rounded-lg shadow relative m-0">
      <div className=" flex flex-col md:flex-row p-8 m-8 gap-4 justify-center">
        <div className="flex flex-row bg-sky-600 m-auto  shadow-2xl shadow-slate-600  bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-6 gap-8 rounded-lg border-2 border-blue-500">
          <div className="text-white  my-auto bg-gradient-to-l from-blue-700 via-blue-800 to-blue-900 rounded-full p-4">
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
                d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
              />
            </svg>
          </div>

          <div className="my-auto">
            <div className="text-xl  font-semibold font-serif text-white">
              Borrowed Assets
            </div>

            <div className="text-lg md:text-2xl  text-white">
              {dataCounts.issuedAssetsCount}
            </div>
          </div>
        </div>
        <div className="flex flex-row bg-sky-600 m-auto  shadow-2xl shadow-slate-600  bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-6 gap-8 rounded-lg border-2 border-blue-500">
          <div className="text-white  my-auto bg-gradient-to-l from-blue-700 via-blue-800 to-blue-900 rounded-full p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </div>
          <div className="my-auto">
            <div className="text-xl  font-semibold font-serif text-white">
              OverDue Assets
            </div>

            <div className="text-2xl  text-white">
              {" "}
              {dataCounts.overdueAssetsCount}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="border-b border-gray-200  pb-4">
          <div className="text-base font-semibold leading-7 pt-4 px-8 text-gray-900">
            New Arrivals
          </div>
          {/* <hr /> */}
          {/* <div className="flex justify-end md:mr-1 lg:mr-30 p-4">
            <Button
              size="small"
              variant="contained"
              className="text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
              onClick={() => router.push(`/libraryassets/list`)}
            >
              See All
            </Button>
          </div> */}
        </div>
      </div>

      <div className="container mx-auto  w-full md:w-[800px] lg:w-[1000px]">
        <div className="flex justify-end  p-4 w-full ">
          <Link href="libraryassets/list">
            <Button
              size="small"
              variant="contained"
              className="text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:ring-sky-200 transition duration-300 ease-in-out transform hover:scale-110 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
            >
              See All
            </Button>
          </Link>
        </div>
        <CarouselComponent />
      </div>
      <div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <div className="text-base font-semibold leading-7 pt-4 px-8 text-gray-900">
              Currently Issued Assets
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="mx-auto w-full md:w-[800px] lg:w-[1000px]">
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow className="bg-sky-600 border-b ">
                      <TableCell
                        className=" font-bold text-white"
                        align="center"
                      >
                        #
                      </TableCell>
                      <TableCell
                        className=" font-bold text-white"
                        align="center"
                      >
                        Title
                      </TableCell>
                      <TableCell
                        className=" font-bold text-white"
                        align="center"
                      >
                        Category
                      </TableCell>
                      <TableCell
                        className=" font-bold text-white"
                        align="center"
                      >
                        Issued Date
                      </TableCell>
                      <TableCell
                        className=" font-bold text-white"
                        align="center"
                      >
                        Due Date
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentissued.map((assets) => {
                      const IssuedDate =
                        assets?.issued_asset?.created_at?.split("T")[0];

                      return (
                        <TableRow
                          className="text-white odd:bg-[#FFFFFF] even:bg-sky-100  border-b"
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="center">{SrNo1++}</TableCell>
                          <TableCell align="center">
                            {assets?.issued_asset?.title}
                          </TableCell>
                          <TableCell align="center">
                            {assets?.issued_asset?.category?.name}
                          </TableCell>
                          <TableCell align="center">{IssuedDate}</TableCell>
                          <TableCell align="center">
                            {assets?.due_date}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <div className="text-base font-semibold leading-7 pt-4 px-8 text-gray-900">
            Currently Re-issued Assets
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="mx-auto w-full md:w-[800px] lg:w-[1000px]">
            <TableContainer
              component={Paper}
              className="mx-auto w-full md:w-[800px] lg:w-[1000px] mb-10"
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow className="bg-sky-600 border-b ">
                    <TableCell className=" font-bold text-white" align="center">
                      #
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Title
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Category
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Re-Issuance Date
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Re-Due Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentreIssued.map((assethistory) => {
                    const reDueDate = assethistory.re_due_date.split("T")[0];

                    return (
                      <TableRow className="text-white odd:bg-[#FFFFFF] even:bg-sky-100  border-b">
                        <TableCell align="center">{SrNo2++}</TableCell>
                        <TableCell align="center">
                          {assethistory?.issued_asset?.title}
                        </TableCell>
                        <TableCell align="center">
                          {assethistory?.issued_asset?.category?.name}
                        </TableCell>
                        <TableCell align="center">
                          {assethistory?.updated_at.split("T")[0]}
                        </TableCell>
                        <TableCell align="center">{reDueDate}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <div className="text-base font-semibold leading-7 pt-4 px-8 text-gray-900">
            Return History
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="mx-auto w-full md:w-[800px] lg:w-[1000px]">
            <TableContainer
              component={Paper}
              className="mx-auto w-full md:w-[800px] lg:w-[1000px] mb-10"
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow className="bg-sky-600 border-b ">
                    <TableCell className=" font-bold text-white" align="center">
                      #
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Title
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Category
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Issued Date
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Due Date
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Re-Due Date
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Return Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((assetreturn) => {
                    const issuedDate = assetreturn.create_at.split("T")[0];
                    const returnDate = assetreturn.return_date.split("T")[0];
                    return (
                      <TableRow className="text-white odd:bg-[#FFFFFF] even:bg-sky-100  border-b">
                        <TableCell align="center">{SrNo3++}</TableCell>
                        <TableCell align="center">
                          {assetreturn?.issued_asset?.title}
                        </TableCell>
                        <TableCell align="center">
                          {assetreturn?.issued_asset?.category?.name}
                        </TableCell>
                        <TableCell align="center">{issuedDate}</TableCell>
                        <TableCell align="center">
                          {assetreturn?.due_date}
                        </TableCell>
                        <TableCell align="center">
                          {assetreturn?.re_due_date}
                        </TableCell>
                        <TableCell align="center">{returnDate}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default Dashboard;

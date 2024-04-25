import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import Layoutt from "../lay/Layoutt";
import { getSession } from "next-auth/react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Fade from "@mui/material/Fade";
import { Stack, Button, Link } from "@mui/material";
import { useRouter } from "next/router";

import CarouselComponent from "./carousal";

function Librarian() {
  const [issuedBy, setIssuedBy] = useState([]);
  const [reIssuedBy, setReIssuedBy] = useState([]);
  const [issuedByHistory, setIssuedByHistory] = useState([]);
  const [reIssuedByHistory, setReIssuedByHistory] = useState([]);
  const [returnByHistory, setReturnByHistory] = useState([]);
  const [dataCounts, setdataCounts] = useState([]);

  const router = useRouter();

  const [expanded, setExpanded] = React.useState(false);

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  useEffect(() => {
    const api = async () => {
      const session = await getSession();

      axios
        .get("/assets/librarianDashboard", {
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
          },
        })
        .then((res) => {
          const {
            issuedBy,
            reIssuedBy,
            issuedByHistory,
            reIssuedByHistory,
            returnByHistory,
            dataCounts,
          } = res.data;
          setIssuedBy(issuedBy),
            setReIssuedBy(reIssuedBy),
            setIssuedByHistory(issuedByHistory),
            setReIssuedByHistory(reIssuedByHistory),
            setReturnByHistory(returnByHistory);
          setdataCounts(dataCounts);
        })
        .catch((err) => console.error(err));
    };
    api();
  }, []);

  let SrNo1 = 1;
  let SrNo2 = 1;
  let SrNo3 = 1;
  let SrNo4 = 1;
  let SrNo5 = 1;

  return (
    <div className="bg-white   border-4 rounded-lg shadow relative m-2">
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
            <Link href="/borrowedassets/list" underline="none">
              <div className="text-xl  font-semibold font-serif text-white">
                Borrowed Assets
              </div>
            </Link>

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
            <Link href="/borrowedassets/list" underline="none">
              <div className="text-xl  font-semibold font-serif text-white">
                OverDue Assets
              </div>
            </Link>
            <div className="text-xl  text-white">
              {" "}
              {dataCounts.overdueAssetsCount}
            </div>
          </div>
        </div>

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
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
          </div>
          <div className="my-auto">
            <Link href="/users/list" underline="none">
              <div className="text-xl  font-semibold font-serif text-white">
                Members
              </div>
            </Link>
            <div className="text-xl  text-white"> {dataCounts.usersCount}</div>
          </div>
        </div>
      </div>
      <div>
        <div className="border-b border-gray-200  pb-4">
          <div className="text-base font-semibold leading-7 pt-4 px-8 text-gray-900">
            New Arrivals
          </div>
          {/* <hr /> */}
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
      <Accordion
        expanded={expanded}
        onChange={handleExpansion}
        slots={{ transition: Fade }}
        slotprops={{ transition: { timeout: 400 } }}
        sx={{
          "& .MuiAccordion-region": { height: expanded ? "auto" : 0 },
          "& .MuiAccordionDetails-root": {
            display: expanded ? "block" : "none",
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <div className="text-base font-semibold leading-7 pt-4 px-8 text-gray-900">
            Currently Issued Assets By You
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="mx-auto w-full md:w-[800px] lg:w-[1000px]">
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow className="bg-sky-600 border-b ">
                    <TableCell className=" font-bold text-white" align="center">
                      #
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Borrower
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {issuedBy.map((assets) => {
                    const IssuedDate =
                      assets?.issued_asset?.created_at?.split("T")[0];

                    return (
                      <TableRow
                        className="text-white odd:bg-[#FFFFFF] even:bg-sky-100  border-b"
                        key={assets.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{SrNo1++}</TableCell>
                        <TableCell align="center">
                          {assets?.borrower?.name}
                        </TableCell>
                        <TableCell align="center">
                          {assets?.issued_asset?.title}
                        </TableCell>
                        <TableCell align="center">
                          {assets?.issued_asset?.category?.name}
                        </TableCell>
                        <TableCell align="center">{IssuedDate}</TableCell>
                        <TableCell align="center">{assets?.due_date}</TableCell>
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
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <div className="text-base font-semibold leading-7 pt-4 px-8 text-gray-900">
            Currently Re-Issued Assets By You
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="mx-auto w-full md:w-[800px] lg:w-[1000px]">
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow className="bg-sky-600 border-b ">
                    <TableCell className=" font-bold text-white" align="center">
                      #
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Borrower
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Title
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Category
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Re-Issued Date
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Re-Due Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reIssuedBy.map((assetsReIssuedBy) => {
                    const IssuedDate =
                      assetsReIssuedBy?.issued_asset?.created_at?.split("T")[0];

                    return (
                      <TableRow
                        className="text-white odd:bg-[#FFFFFF] even:bg-sky-100  border-b"
                        key={assetsReIssuedBy.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{SrNo2++}</TableCell>
                        <TableCell align="center">
                          {assetsReIssuedBy?.borrower?.name}
                        </TableCell>
                        <TableCell align="center">
                          {assetsReIssuedBy?.issued_asset?.title}
                        </TableCell>
                        <TableCell align="center">
                          {assetsReIssuedBy?.issued_asset?.category?.name}
                        </TableCell>
                        <TableCell align="center">{IssuedDate}</TableCell>
                        <TableCell align="center">
                          {assetsReIssuedBy?.due_date}
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
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <div className="text-base font-semibold leading-7 pt-4 px-8 text-gray-900">
            Issued Assets By You History
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
                      User
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
                      Return Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {issuedByHistory.map((assethistory) => {
                    const IssuedDate =
                      assethistory?.issued_asset?.created_at?.split("T")[0];
                    const returnDate = assethistory.return_date.split("T")[0];
                    return (
                      <TableRow
                        className="text-white odd:bg-[#FFFFFF] even:bg-sky-100  border-b"
                        key={assethistory.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{SrNo3++}</TableCell>
                        <TableCell align="center">
                          {assethistory?.borrower?.name}
                        </TableCell>
                        <TableCell align="center">
                          {assethistory?.issued_asset?.title}
                        </TableCell>
                        <TableCell align="center">
                          {assethistory?.issued_asset?.category?.name}
                        </TableCell>
                        <TableCell align="center">{IssuedDate}</TableCell>
                        <TableCell align="center">
                          {assethistory?.due_date}
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
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <div className="text-base font-semibold leading-7 pt-4 px-8 text-gray-900">
            Re-Issued Assets By You History
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
                      User
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Title
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Category
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Re-Issued Date
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Re-Due Date
                    </TableCell>
                    <TableCell className=" font-bold text-white" align="center">
                      Return Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                {reIssuedByHistory.length > 0 && (
                  <TableBody>
                    {reIssuedByHistory.map((reissuedhistory) => {
                      const IssuedDate =
                        reissuedhistory?.issued_asset?.created_at?.split(
                          "T"
                        )[0];
                      const returnDate =
                        reissuedhistory.return_date.split("T")[0];
                      return (
                        <TableRow
                          className="text-white odd:bg-[#FFFFFF] even:bg-sky-100  border-b"
                          key={reissuedhistory.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="center">{SrNo4++}</TableCell>
                          <TableCell align="center">
                            {reissuedhistory?.borrower?.name}
                          </TableCell>
                          <TableCell align="center">
                            {reissuedhistory?.issued_asset?.title}
                          </TableCell>
                          <TableCell align="center">
                            {reissuedhistory?.issued_asset?.category?.name}
                          </TableCell>
                          <TableCell align="center">{IssuedDate}</TableCell>
                          <TableCell align="center">
                            {reissuedhistory?.due_date}
                          </TableCell>
                          <TableCell align="center">{returnDate}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <div className="text-base font-semibold leading-7 pt-0 px-6 text-gray-900">
            Return Assets By You History
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
                      Return Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {returnByHistory.map((returnhistory) => {
                    const IssuedDate =
                      returnhistory?.issued_asset?.created_at?.split("T")[0];
                    const returnDate = returnhistory.return_date.split("T")[0];
                    return (
                      <TableRow
                        className="text-white odd:bg-[#FFFFFF] even:bg-sky-100  border-b"
                        key={returnhistory.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{SrNo5++}</TableCell>
                        <TableCell align="center">
                          {returnhistory?.issued_asset?.title}
                        </TableCell>
                        <TableCell align="center">
                          {returnhistory?.issued_asset?.category?.name}
                        </TableCell>
                        <TableCell align="center">{IssuedDate}</TableCell>

                        <TableCell align="center">
                          {returnhistory?.due_date}
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

export default Librarian;

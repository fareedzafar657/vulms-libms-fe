import React, { useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Layoutt from "../../../component/lay/Layoutt";
import axios from "axios";
import { getSession } from "next-auth/react";
import Barcode from "react-barcode";

export async function getServerSideProps(context) {
  const { params } = context;
  const session = await getSession(context);
  const response = await axios.get(`/assets/findOne/${params.Noveldetail}`, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });
  const { data } = response;
  const roles = session?.user.user.roles.map((role) => role.name);
  const librarian = roles.includes("librarian");
  return {
    props: {
      novel: data,
      librarian: librarian,
    },
  };
}

function Noveldetail({ novel, librarian }) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [value, setValue] = React.useState("1");
  const router = useRouter();
  const available = novel.is_available;
  const statusColor = available ? "green" : "red";

  const handleIssueButtonClick = () => {
    router.push(`/novels/issuance/${novel.id}`);
  };

  const handleReissueButtonClick = () => {
    router.push(`/novels/reIssuance/${novel.id}`);
  };

  const handleReturnButtonClick = () => {
    router.push(`/novels/return/${novel.id}`);
  };

  return (
    <Layoutt>
      <div className="bg-white p-6 space-y-6  border-4 rounded-lg shadow relative ">
        <div className="flex justify-center p-5 border-b rounded-t">
          <h3 className="text-3xl  text-sky-700 font-bold">Novel Details</h3>
        </div>
        <div className="border-b border-gray-200  pb-4">
          <h2 className="text-base font-semibold leading-7 pt-4 px-8 text-gray-900">
            Details
          </h2>
        </div>

        <div className="max-w-sm pt-6 px-32  flex ">
          <img
            src={`${process.env.NEXT_PUBLIC_BE_URL}${novel.cover}`}
            alt="image"
            className="selected-image"
            width={200}
            height={200}
          />
          <div className="flex px-10">
            <div>
              <ul>
                <li className="flex items-center font-bold text-black">
                  <span className="mr-2">Title:</span> {novel.title}
                </li>
                <li className="flex items-center font-bold text-red-500">
                  <span className="mr-2">By:</span> {novel.author}
                </li>
                <li className="flex items-center font-bold text-black">
                  <span className="mr-2">Category:</span> {novel.category.name}
                </li>
                <li className="flex items-center font-bold text-black">
                  <span className="mr-2">Language:</span>{" "}
                  {novel.location ? novel.location.name : null}
                </li>
                <li className=" flex font-bold text-black">
                  Availability:
                  <span style={{ color: statusColor }}>
                    {available ? "Yes" : "No"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="my-4 max-w-screen-lg border px-4 shadow-xl sm:mx-4 sm:rounded-xl sm:px-4 sm:py-4 md:mx-auto">
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Detail" value="1" />
                  <Tab label="Description" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <div className="flex gap-40 ">
                  <div>
                    <ul>
                      <li className="flex items-center text-sm  text-black">
                        <span className="mr-2">Title:</span> {novel.title}
                      </li>
                      <li className="flex items-center text-sm  text-black">
                        <span className="mr-2">Author:</span> {novel.author}
                      </li>
                      <li className="flex items-center text-sm  text-black">
                        <span className="mr-2">Distributor:</span>{" "}
                        {novel.distributer ? novel.distributer.name : null}
                      </li>
                      <li className="flex items-center text-sm  text-black">
                        <span className="mr-2">Material Type:</span>{" "}
                        {novel.material_type.name}
                      </li>
                      <li className="flex items-center text-sm  text-black">
                        <span className="mr-2">Date of purchase:</span>{" "}
                        {novel.date_of_purchase}
                      </li>
                      <li className="flex items-center text-sm  text-black">
                        <span className="mr-2">Total Pages:</span>{" "}
                        {novel.total_pages}
                      </li>
                      {librarian ? (
                        <>
                          <li className="flex items-center text-sm  text-black">
                            <span className="mr-2">Created By:</span>{" "}
                            {novel.created_by_user.name}
                          </li>
                          <li className="flex items-center text-sm text-black">
                            <span className="mr-2">Updated By:</span>
                            {novel.updated_by_user
                              ? novel.updated_by_user.name
                              : null}
                          </li>
                          <li className="flex items-center text-sm text-black">
                            <span className="mr-2">Archieved By:</span>
                            {novel.archived_by_user
                              ? novel.archived_by_user.name
                              : null}
                          </li>
                        </>
                      ) : null}
                    </ul>
                  </div>
                  <div>
                    <ul>
                      <li className="flex items-center text-sm  text-black">
                        <span className="mr-2">Sub title:</span>{" "}
                        {novel.subTitle}
                      </li>
                      <li className="flex items-center text-sm  text-black">
                        <span className="mr-2">Sub Authors:</span>{" "}
                        {novel.subAuthor.map((author, index) => (
                          <span key={index}>
                            {author}
                            {index !== novel.subAuthor.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </li>
                      <li className="flex items-center text-sm  text-black">
                        <span className="mr-2">Publisher:</span>{" "}
                        {novel.publisher.name}
                      </li>
                      <li className="flex items-center text-sm  text-black">
                        <span className="mr-2">Price:</span> {novel.price}
                      </li>
                      <li className="flex items-center text-sm  text-black">
                        <span className="mr-2">Language:</span>{" "}
                        {novel.language ? novel.language.name : null}
                      </li>
                      <li className="flex items-center text-sm  text-black">
                        <span className="mr-2">location:</span>{" "}
                        {novel.location ? novel.location.name : null}
                      </li>
                      <li className="flex items-center text-sm  text-black">
                        <span className="mr-2">Location Placed:</span>{" "}
                        {novel.location_placed}
                      </li>
                      <li className="flex items-center text-sm  text-black">
                        <span className="mr-2">Donated By:</span>{" "}
                        {novel.donated_by}
                      </li>
                    </ul>
                  </div>
                </div>
                <Barcode value={novel.barcode} />
              </TabPanel>
              <TabPanel value="2">{novel.description}</TabPanel>
            </TabContext>
          </Box>
        </div>
        {librarian ? (
          <>
            <Stack
              direction={"row"}
              spacing={2}
              className="flex justify-end px-12 pb-8"
            >
              <Button
                size="small"
                variant="contained"
                className="text-white bg-slate-500 hover:bg-slate-600 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                onClick={() => router.push(`/novels/list`)}
              >
                Novel List
              </Button>
              {available ? (
                <Button
                  size="small"
                  variant="contained"
                  className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                  onClick={handleIssueButtonClick}
                >
                  Issue
                </Button>
              ) : (
                <>
                  <Button
                    size="small"
                    variant="contained"
                    className="text-white bg-slate-500 hover:bg-slate-600 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                    onClick={handleReissueButtonClick}
                  >
                    Re-issue
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    type="submit"
                    className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-sky-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-24"
                    onClick={handleReturnButtonClick}
                  >
                    Return
                  </Button>
                </>
              )}
            </Stack>
          </>
        ) : null}
      </div>
    </Layoutt>
  );
}

export default Noveldetail;

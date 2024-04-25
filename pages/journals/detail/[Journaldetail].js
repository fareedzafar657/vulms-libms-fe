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
import useAxiosAuth from "../../../lib/hooks/useAxiosAuth";
import Barcode from "react-barcode";

export async function getServerSideProps(context) {
  const { params } = context;
  const session = await getSession(context);
  const response = await axios.get(`/assets/findOne/${params.Journaldetail}`, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });
  const { data } = response;
  const roles = session?.user.user.roles.map((role) => role.name);
  const librarian = roles.includes("librarian");

  return {
    props: {
      journals: data,
      librarian: librarian,
    },
  };
}

function Journalsdetail({ journals, librarian }) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const isReIssuanceActive = journals.is_available === "active";
  const [value, setValue] = React.useState("1");
  const router = useRouter();
  const available = journals.is_available;
  const statusColor = available ? "green" : "red";

  const handleissueButtonClick = () => {
    router.push(`/journals/issuance/${journals.id}`);
  };

  const handleReissueButtonClick = () => {
    router.push(`/journals/reIssuance/${journals.id}`);
  };

  const handleReturnButtonClick = () => {
    router.push(`/journals/return/${journals.id}`);
  };

  return (
    <Layoutt>
      <div className="bg-white  border-4 rounded-lg shadow relative ">
        <div className="flex justify-center p-5 border-b rounded-t">
          <h3 className="text-3xl  text-sky-700 font-bold">Journals Details</h3>
        </div>
        <div className="border-b border-gray-200  pb-4">
          <h2 className="text-base font-semibold leading-7 pt-4 px-8 text-gray-900">
            Details
          </h2>
        </div>

        <div className="min-w-sm pt-6 px-32  flex ">
          <img
            src={`${process.env.NEXT_PUBLIC_BE_URL}${journals.cover}`}
            alt="image"
            className="selected-image"
            width={200}
            height={200}
          />
          <div className="flex px-10">
            <div>
              <ul>
                <li className=" flex font-bold text-black">{journals.title}</li>
                <li className="flex font-bold text-red-500">
                  Volume No: {journals.volume_no}
                </li>

                <li className="flex font-bold text-black">
                  Language: {journals.language.name}
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
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Title:</span>{" "}
                        {journals.title}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Volume No:</span>{" "}
                        {journals.volume_no}
                      </li>
                      {/*  <li className="flex items-center text-sm text-black">
                        Distributor: {journals.distributers}
                      </li> */}
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Material Type:</span>{" "}
                        {journals.material_type.name}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">
                          Date of Purchase:
                        </span>{" "}
                        {journals.date_of_purchase}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold"> Total Pages:</span>{" "}
                        {journals.total_pages}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Location:</span>{" "}
                        {journals.location.name}
                      </li>

                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Donated By:</span>{" "}
                        {journals.donated_by}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Updated By:</span>
                        {journals.updated_by_user
                          ? journals.updated_by_user.name
                          : null}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <ul>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Sub title:</span>{" "}
                        {journals.subTitle}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Version No:</span>{" "}
                        {journals.version_no}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Publisher:</span>{" "}
                        {journals.publisher.name}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Publisher Date:</span>{" "}
                        {journals.publishing_date}
                      </li>

                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Price:</span>{" "}
                        {journals.price}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Language:</span>{" "}
                        {journals.language.name}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Location Placed:</span>{" "}
                        {journals.location_placed}
                      </li>
                      {librarian ? (
                        <>
                          <li className="flex items-center text-sm text-black">
                            <span className="mr-2 font-bold"> Created By:</span>{" "}
                            {journals.created_by_user.name}
                          </li>
                          <li className="flex items-center text-sm text-black">
                            <span className="mr-2 font-bold">
                              Archieved By:
                            </span>
                            {journals.archived_by_user
                              ? journals.archived_by_user.name
                              : null}
                          </li>
                        </>
                      ) : null}
                    </ul>
                  </div>
                </div>
                <Barcode value={journals.barcode} />
              </TabPanel>
              <TabPanel value="2"> {journals.description}</TabPanel>
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
                onClick={() => router.push(`/journals/list`)}
              >
                Journal List
              </Button>
              {available ? (
                <Button
                  size="small"
                  variant="contained"
                  className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
                  onClick={handleissueButtonClick}
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

export default Journalsdetail;

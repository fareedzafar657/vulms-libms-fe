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
  const response = await axios.get(`/assets/findOne/${params.Magazinedetail}`, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });
  const { data } = response;
  const roles = session?.user.user.roles.map((role) => role.name);
  const librarian = roles.includes("librarian");

  return {
    props: {
      magazines: data,
      librarian: librarian,
    },
  };
}

function Magazinedetail({ magazines, librarian }) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [value, setValue] = React.useState("1");
  const router = useRouter();
  const available = magazines.is_available;
  const statusColor = available ? "green" : "red";

  const handleissueButtonClick = () => {
    router.push(`/magazines/issuance/${magazines.id}`);
  };

  const handleReissueButtonClick = () => {
    router.push(`/magazines/reIssuance/${magazines.id}`);
  };

  const handleReturnButtonClick = () => {
    router.push(`/magazines/return/${magazines.id}`);
  };

  return (
    <Layoutt>
      <div className="bg-white  border-4 rounded-lg shadow relative ">
        <div className="flex justify-center p-5 border-b rounded-t">
          <h3 className="text-3xl  text-sky-700 font-bold">Magazine Details</h3>
        </div>
        <div className="border-b border-gray-200  pb-4">
          <h2 className="text-base font-semibold leading-7 pt-4 px-8 text-gray-900">
            Details
          </h2>
        </div>

        <div className="min-w-sm pt-6 px-32  flex ">
          <img
            src={`${process.env.NEXT_PUBLIC_BE_URL}${magazines.cover}`}
            alt="image"
            className="selected-image"
            width={200}
            heig
            ht={200}
          />
          <div className="flex px-10">
            <div>
              <ul>
                <li className=" flex font-bold text-black">
                  {magazines?.title}
                </li>
                <li className=" flex font-bold text-red-500">
                  Volume No: {magazines?.volume_no}
                </li>

                <li className=" flex font-bold text-black">
                  Language: {magazines?.language?.name}
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
                        {magazines?.title}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold"> Volume No:</span>{" "}
                        {magazines?.volume_no}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold"> Distributer:</span>{" "}
                        {magazines?.distributer.name}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold"> Material Type:</span>{" "}
                        {magazines?.material_type.name}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">
                          {" "}
                          Date of Purchase:
                        </span>{" "}
                        {magazines?.date_of_purchase}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold"> Total Pages:</span>{" "}
                        {magazines?.total_pages}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Location:</span>{" "}
                        {magazines?.location?.name}
                      </li>
                      {librarian ? (
                        <>
                          <li className="flex items-center text-sm text-black">
                            <span className="mr-2 font-bold">Donated By:</span>{" "}
                            {magazines?.donated_by}
                          </li>
                          <li className="flex items-center text-sm text-black">
                            <span className="mr-2 font-bold">Updated By:</span>
                            {magazines.updated_by_user
                              ? magazines?.updated_by_user.name
                              : null}
                          </li>
                        </>
                      ) : null}
                    </ul>
                  </div>
                  <div>
                    <ul>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Sub title:</span>{" "}
                        {magazines?.subTitle}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold"> Version No:</span>{" "}
                        {magazines?.version_no}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Publisher:</span>{" "}
                        {magazines?.publisher.name}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold"> Publisher Date:</span>{" "}
                        {magazines?.publishing_date}
                      </li>

                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Price:</span>{" "}
                        {magazines?.price}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Language:</span>{" "}
                        {magazines?.language.name}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Location Placed:</span>{" "}
                        {magazines?.location_placed}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold">Created By:</span>{" "}
                        {magazines?.created_by_user.name}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2 font-bold"> Archieved By:</span>
                        {magazines?.archived_by_user
                          ? magazines?.archived_by_user.name
                          : null}
                      </li>
                    </ul>
                  </div>
                </div>
                <Barcode value={magazines.barcode} />
              </TabPanel>
              <TabPanel value="2"> {magazines?.description}</TabPanel>
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
                onClick={() => router.push(`/magazines/list`)}
              >
                magazine List
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

export default Magazinedetail;

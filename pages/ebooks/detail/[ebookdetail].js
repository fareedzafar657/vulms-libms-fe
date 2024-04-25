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

export async function getServerSideProps(context) {
  const { params } = context;
  const session = await getSession(context);
  const response = await axios.get(`/assets/findOne/${params.ebookdetail}`, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });
  const { data } = response;
  return {
    props: {
      book: data,
    },
  };
}

function ebookdetail({ book }) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [value, setValue] = React.useState("1");
  const router = useRouter();
  const available = book.is_available;
  const statusColor = available ? "green" : "red";
  const axiosAuth = useAxiosAuth();

  const handleReadButtonClick = () => {
    // Check if window is defined to ensure it's executed only on the client-side
    if (typeof window !== "undefined") {
      window.open(`${process.env.NEXT_PUBLIC_BE_URL}${book.pdf}`, "_blank");
    }
  };

  return (
    <Layoutt>
      <div className="bg-white  border-4 rounded-lg shadow relative ">
        <div className="flex justify-center p-5 border-b rounded-t">
          <h3 className="text-3xl  text-sky-700 font-bold">e-Book Details</h3>
        </div>
        <div className="border-b border-gray-200  pb-4">
          <h2 className="text-base font-semibold leading-7 pt-4 px-8 text-gray-900">
            Details
          </h2>
        </div>

        <div className="min-w-sm pt-6 px-32  flex ">
          <img
            src={`${process.env.NEXT_PUBLIC_BE_URL}${book.cover}`}
            alt="image"
            className="selected-image"
            width={200}
            height={200}
          />
          <div className="flex px-10">
            <div>
              <ul>
                <li className=" flex font-bold text-black"> {book.title}</li>
                <li className="flex font-bold text-red-500">
                  By: {book.author}
                </li>

                <li className="flex font-bold text-black">
                  Category: {book.category?.name}
                </li>
                <li className="flex font-bold text-black">
                  Language: {book.language?.name}
                </li>
                <li className="flex font-bold text-black">
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
                      <li className="text-sm text-black">
                        Title: {book.title}
                      </li>
                      <li className="text-sm text-black">
                        Author: {book.author}
                      </li>
                      <li className="text-sm text-black">
                        Distributor: {book.distributer?.name}
                      </li>
                      <li className="text-sm text-black">
                        Material Type: {book.material_type?.name}
                      </li>
                      <li className="text-sm text-black">
                        Date of purchase: {book.date_of_purchase}
                      </li>
                      <li className="text-sm text-black">
                        Total Pages: {book.total_pages}
                      </li>
                      <li className="text-sm text-black">
                        Created By: {book.created_by_user.name}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2">Archieved By:</span>
                        {book.archived_by_user
                          ? book.archived_by_user.name
                          : null}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <ul>
                      <li className="text-sm text-black">
                        Sub title: {book.subTitle}
                      </li>
                      <li className="text-sm text-black">
                        Sub Auhors:{" "}
                        {book.subAuthor.map((author, index) => (
                          <span key={index}>
                            {author}
                            {index !== book.subAuthor.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </li>
                      <li className="text-sm text-black">
                        Publisher: {book.publisher?.name}
                      </li>
                      <li className="text-sm text-black">
                        Price: {book.price}
                      </li>
                      <li className="text-sm text-black">
                        Language: {book.language?.name}
                      </li>

                      <li className="text-sm text-black">
                        Donated By: {book.donated_by}
                      </li>
                      <li className="flex items-center text-sm text-black">
                        <span className="mr-2">Updated By:</span>
                        {book.updated_by_user
                          ? book.updated_by_user.name
                          : null}
                      </li>
                    </ul>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="2">{book.description}</TabPanel>
            </TabContext>
          </Box>
        </div>
        <Stack
          direction={"row"}
          spacing={2}
          className="flex justify-end px-12 pb-8"
        >
          <Button
            size="small"
            variant="contained"
            className="text-white bg-slate-500 hover:bg-slate-600 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
            onClick={() => router.push(`/ebooks/list`)}
          >
            Ebook List
          </Button>
          <Button
            size="small"
            variant="contained"
            className="text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 transition duration-300 ease-in-out transform hover:scale-110 focus:ring-slate-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center m-2"
            onClick={handleReadButtonClick}
            disabled={book.pdf ? false : true}
          >
            Read
          </Button>
        </Stack>
      </div>
    </Layoutt>
  );
}

export default ebookdetail;

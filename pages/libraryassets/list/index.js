import React from "react";
import axios from "axios";
import { useState } from "react";
import { Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import Layoutt from "../../../component/lay/Layoutt";
import Card from "@mui/material/Card";
import FiltersControls from "../../../component/Filters/FiltersControls";
import fetchAssetsFilteredData from "../../../component/ListComponents/LibraryAssetsList/assetsFilteredData";
import AssetsListFilters from "../../../component/ListComponents/LibraryAssetsList/AssetsListFilters";
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

  try {
    const res = await axios.get(`/assets/pagedata?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
      },
    });
    const getData = res.data;

    return {
      props: {
        records: getData.pagedata,
        publishers: getData.publishers,
        material_types: getData.material_types,
        languages: getData.languages,
        locations: getData.locations,
        category: getData.category,
        departments: getData.departments,
      },
    };
  } catch (error) {
    console.error("Failed to fetch Data.", error);
  }
}

function assets({
  records,
  distributers,
  material_types,
  languages,
  locations,
  category,
  Sort,
  departments,
}) {
  const [pagedata, setPagedata] = useState(records);
  const [currentPage, setCurrentPage] = useState(pagedata.meta.page);
  const currentTake = pagedata.meta.take;
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <Layoutt>
      <div className="flex flex-col md:flex-row gap-4 ">
        <div className="w-full md:w-1/4 p-4 mb-80">
          <AssetsListFilters
            setPagedata={setPagedata}
            searchParams={searchParams}
            router={router}
            setCurrentPage={setCurrentPage}
            Sort={Sort}
            distributers={distributers}
            material_types={material_types}
            languages={languages}
            locations={locations}
            category={category}
            departments={departments}
          />
        </div>
        <div className="w-full flex flex-col gap-4 p-4 ">
          <p className="text-blue-900 text-xl font-extrabold mb-4">
            Library Assets List
          </p>
          {pagedata.data.map((asset) => {
            return card(asset);
          })}
        </div>
      </div>
      <div className="pt-80">
        <div className="relative bg-white border border-gray-300 pt-6   shadow-xl mx-auto min-w-full rounded-md overflow-x-auto">
          <div className="flex justify-between p-4">
            <Stack spacing={2} className="md:ml-36">
              <FiltersControls
                control="take"
                setPagedata={setPagedata}
                filteringData={fetchAssetsFilteredData}
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
                filteringData={fetchAssetsFilteredData}
              />
            </Stack>
          </div>
        </div>
      </div>
    </Layoutt>
  );
}

export default assets;

const card = (asset) => {
  // console.error("===========", asset);

  if (asset.category.name === "Book") {
    return (
      <Card
        key={asset.id}
        className="flex flex-col p-4 text-lg font-semibold shadow-md border rounded-sm"
      >
        <div className="flex flex-col md:flex-row gap-3 justify-between">
          <div className="flex flex-row gap-6 items-center">
            <div className="w-28 h-30">
              <img
                src={`${process.env.NEXT_PUBLIC_BE_URL}${asset.cover}`}
                alt="image"
                className="selected-image"
              />
            </div>
            <div className="flex flex-col gap-1">
              <ul>
                <li className="flex items-center font-sans text-black">
                  <span className="mr-2">Title:</span> {asset.title}
                </li>
                <li className="flex items-center text-gray-600 font-sans ">
                  <span className="mr-2">By:</span> {asset.author}
                </li>
                <li className="flex items-center  text-gray-600 font-sans">
                  <span className="mr-2">Publisher:</span>
                  {asset.publisher.name}
                </li>
              </ul>
              <div className="inline-flex">
                <button
                  className="bg-gray-800 text-white active:bg-gray-800 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  {asset.category.name}
                </button>
                <button
                  className="bg-gray-800 text-white active:bg-gray-800 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  {asset.language?.name}
                </button>
                <button
                  className="bg-gray-800 text-white active:bg-gray-800 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  {asset.location?.name}
                </button>
                <button
                  className={`${
                    asset.is_available ? "bg-green-500" : "bg-red-500"
                  } text-white active:bg-gray-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                  type="button"
                >
                  {asset.is_available ? "Available" : "Issued"}
                </button>
              </div>
            </div>
          </div>

          <div className="self-center text-center text-sky-600 transition duration-300 ease-in-out transform hover:scale-110">
            <a href={`/books/detail/${asset.id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path
                  fillRule="evenodd"
                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </Card>
    );
  }
  if (asset.category.name === "Journal") {
    return (
      <Card
        key={asset.id}
        className="flex flex-col p-4 text-lg font-semibold shadow-md border rounded-sm"
      >
        <div className="flex flex-col md:flex-row gap-3 justify-between">
          <div className="flex flex-row gap-6 items-center">
            <div className="w-28 h-30">
              <img
                src={`${process.env.NEXT_PUBLIC_BE_URL}${asset.cover}`}
                alt="image"
                className="selected-image"
              />
            </div>
            <div className="flex flex-col gap-1">
              <ul>
                <li className="flex items-center font-sans text-black">
                  <span className="mr-2">Title:</span> {asset.title}
                </li>
                <li className="flex items-center text-gray-600 font-sans ">
                  <span className="mr-2">Volume:</span>
                  {asset.volume_no}
                </li>
                <li className="flex items-center  text-gray-600 font-sans">
                  <span className="mr-2">Publisher:</span>
                  {asset.publisher.name}
                </li>
              </ul>
              <div className="inline-flex">
                <button
                  className="bg-gray-800 text-white active:bg-gray-800 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  {asset.category.name}
                </button>
                <button
                  className="bg-gray-800 text-white active:bg-gray-800 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  {asset.language?.name}
                </button>
                <button
                  className="bg-gray-800 text-white active:bg-gray-800 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  {asset.location?.name}
                </button>
                <button
                  className={`${
                    asset.is_available ? "bg-green-500" : "bg-red-500"
                  } text-white active:bg-gray-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                  type="button"
                >
                  {asset.is_available ? "Available" : "Issued"}
                </button>
              </div>
            </div>
          </div>

          <div className="self-center text-center text-sky-600 transition duration-300 ease-in-out transform hover:scale-110">
            <a href={`/journals/detail/${asset.id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path
                  fillRule="evenodd"
                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </Card>
    );
  }
  if (asset.category.name === "Magazine") {
    return (
      <Card
        key={asset.id}
        className="flex flex-col p-4 text-lg font-semibold shadow-md border rounded-sm"
      >
        <div className="flex flex-col md:flex-row gap-3 justify-between">
          <div className="flex flex-row gap-6 items-center">
            <div className="w-28 h-30">
              <img
                src={`${process.env.NEXT_PUBLIC_BE_URL}${asset.cover}`}
                alt="image"
                className="selected-image"
              />
            </div>
            <div className="flex flex-col gap-1">
              <ul>
                <li className="flex items-center font-sans text-black">
                  <span className="mr-2">Title:</span> {asset.title}
                </li>
                <li className="flex items-center text-gray-600 font-sans ">
                  <span className="mr-2">Volume:</span>
                  {asset.volume_no}
                </li>
                <li className="flex items-center  text-gray-600 font-sans">
                  <span className="mr-2">Publisher:</span>
                  {asset.publisher.name}
                </li>
              </ul>
              <div className="inline-flex">
                <button
                  className="bg-gray-800 text-white active:bg-gray-800 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  {asset.category.name}
                </button>
                <button
                  className="bg-gray-800 text-white active:bg-gray-800 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  {asset.language?.name}
                </button>
                <button
                  className="bg-gray-800 text-white active:bg-gray-800 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  {asset.location?.name}
                </button>
                <button
                  className={`${
                    asset.is_available ? "bg-green-500" : "bg-red-500"
                  } text-white active:bg-gray-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                  type="button"
                >
                  {asset.is_available ? "Available" : "Issued"}
                </button>
              </div>
            </div>
          </div>

          <div className="self-center text-center text-sky-600 transition duration-300 ease-in-out transform hover:scale-110">
            <a href={`/magazines/detail/${asset.id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path
                  fillRule="evenodd"
                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </Card>
    );
  }
  if (asset.category.name === "Novel") {
    return (
      <Card
        key={asset.id}
        className="flex flex-col p-4 text-lg font-semibold shadow-md border rounded-sm"
      >
        <div className="flex flex-col md:flex-row gap-3 justify-between">
          <div className="flex flex-row gap-6 items-center">
            <div className="w-28 h-30">
              <img
                src={`${process.env.NEXT_PUBLIC_BE_URL}${asset.cover}`}
                alt="image"
                className="selected-image"
              />
            </div>
            <div className="flex flex-col gap-1">
              <ul>
                <li className="flex items-center font-sans text-black">
                  <span className="mr-2">Title:</span> {asset.title}
                </li>
                <li className="flex items-center text-gray-600 font-sans ">
                  <span className="mr-2">By:</span> {asset.author}
                </li>
                <li className="flex items-center  text-gray-600 font-sans">
                  <span className="mr-2">Publisher:</span>
                  {asset.publisher.name}
                </li>
              </ul>
              <div className="inline-flex">
                <button
                  className="bg-gray-800 text-white active:bg-gray-800 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  {asset.category.name}
                </button>
                <button
                  className="bg-gray-800 text-white active:bg-gray-800 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  {asset.language?.name}
                </button>
                <button
                  className="bg-gray-800 text-white active:bg-gray-800 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  {asset.location?.name}
                </button>
                <button
                  className={`${
                    asset.is_available ? "bg-green-500" : "bg-red-500"
                  } text-white active:bg-gray-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                  type="button"
                >
                  {asset.is_available ? "Available" : "Issued"}
                </button>
              </div>
            </div>
          </div>

          <div className="self-center text-center text-sky-600 transition duration-300 ease-in-out transform hover:scale-110">
            <a href={`/novels/detail/${asset.id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path
                  fillRule="evenodd"
                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </Card>
    );
  }
  if (asset.category.name === "ebook") {
    return (
      <Card
        key={asset.id}
        className="flex flex-col p-4 text-lg font-semibold shadow-md border rounded-sm"
      >
        <div className="flex flex-col md:flex-row gap-3 justify-between">
          <div className="flex flex-row gap-6 items-center">
            <div className="w-28 h-30">
              <img
                src={`${process.env.NEXT_PUBLIC_BE_URL}${asset.cover}`}
                alt="image"
                className="selected-image"
              />
            </div>
            <div className="flex flex-col gap-1">
              <ul>
                <li className="flex items-center font-sans text-black">
                  <span className="mr-2">Title:</span> {asset.title}
                </li>
                <li className="flex items-center text-gray-600 font-sans ">
                  <span className="mr-2">By:</span> {asset.author}
                </li>
                <li className="flex items-center  text-gray-600 font-sans">
                  <span className="mr-2">Publisher:</span>
                  {asset.publisher.name}
                </li>
              </ul>
              <div className="inline-flex">
                <button
                  className="bg-gray-800 text-white active:bg-gray-800 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  {asset.category.name}
                </button>
                <button
                  className="bg-gray-800 text-white active:bg-gray-800 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  {asset.language?.name}
                </button>
                <button
                  className="bg-gray-800 text-white active:bg-gray-800 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  {asset.departments?.name}
                </button>
              </div>
            </div>
          </div>
          <div className="self-center text-center text-sky-600 transition duration-300 ease-in-out transform hover:scale-110">
            <a href={`/ebooks/detail/${asset.id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path
                  fillRule="evenodd"
                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </Card>
    );
  }
};

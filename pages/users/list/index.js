import React, { useEffect } from "react";
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
  Switch,
  Link,
} from "@mui/material";
import Filter from "../../../component/ListComponents/UsersList/UsersListFilters";
import DeleteButton from "../../../component/common/DeleteButton";
import EditButton from "../../../component/common/EditButton";
import Layoutt from "../../../component/lay/Layoutt";
import Swal from "sweetalert2";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import FiltersControls from "../../../component/Filters/FiltersControls";
import fetchFilteredData from "../../../component/ListComponents/UsersList/FilteredData";
import { getSession } from "next-auth/react";
import useAxiosAuth from "../../../lib/hooks/useAxiosAuth";

export async function getServerSideProps(context) {
  const data = context.query;
  const session = await getSession(context);

  const params = new URLSearchParams();

  if (data.search) {
    params.set("search", data.search);
  }
  if (data.roles) {
    params.set("roles", data.roles);
  }
  if (data.department) {
    params.set("department", data.department);
  }
  if (data.designation) {
    params.set("designation", data.designation);
  }
  if (data.status) {
    params.set("status", data.status);
  }
  if (data.take) {
    params.set("take", data.take);
  }
  if (data.page) {
    params.set("page", data.page);
  }
  if (data.orderBy) {
    params.set("orderBy", data.orderBy);
  }
  if (data.order) {
    params.set("order", data.order);
  }

  try {
    const res = await axios.get(`/users/pagedata?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
      },
    });
    const getData = res.data;

    return {
      props: {
        departments: getData.departments,
        designations: getData.designations,
        roles: getData.roles,
        pagedata: getData.pagedata,
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

function users({ designations, departments, roles, pagedata, error }) {
  const router = useRouter();
  if (error) {
    useEffect(() => {
      if (error) {
        return Swal.fire({
          text: error,
          icon: "error",
        }).then(() => {
          router.push("/_error.js");
        });
      }
    }, [error]);
  }
  const [filteredUsers, setFilteredUsers] = useState(pagedata);
  const [currentPage, setCurrentPage] = useState(filteredUsers?.meta.page);
  const currentTake = filteredUsers?.meta.take;
  const searchParams = useSearchParams();
  const axiosAuth = useAxiosAuth();
  let SrNo = 1;
  const [userActiveStatus, setUserActiveStatus] = useState({});

  useEffect(() => {
    // Initialize user active status state
    const initialUserActiveStatus = {};
    filteredUsers?.data.forEach((user) => {
      initialUserActiveStatus[user.id] = user.is_active;
    });
    setUserActiveStatus(initialUserActiveStatus);
  }, [filteredUsers]);

  const handleToggleActive = async (userId) => {
    try {
      // Update local state
      setUserActiveStatus((prevState) => ({
        ...prevState,
        [userId]: !prevState[userId],
      }));

      // Make API call to update active status
      await axiosAuth.get(`users/activation/${userId}`);
    } catch (error) {
      console.error("Failed to toggle active status.", error);
    }
  };

  return (
    <Layoutt>
      <div className="relative bg-white border border-gray-300 pt-6 pb-6 p-4 shadow-xl mx-auto min-w-full 3xl:w-[1920px]  rounded-md overflow-x-auto">
        <Filter
          designations={designations}
          departments={departments}
          roles={roles}
          setFilteredUsers={setFilteredUsers}
          searchParams={searchParams}
          router={router}
          setCurrentPage={setCurrentPage}
        />

        <div className="mx-auto w-full md:w-[800px] lg:w-[1000px]">
          <div className="flex justify-end  p-4 w-full ">
            <Stack direction={"row"} spacing={2}>
              <Link href="/users/registration" underline="none">
                <Button
                  size="small"
                  variant="contained"
                  className="text-white  bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-200 font-bold transition duration-300 ease-in-out transform hover:scale-110 rounded-lg text-sm px-5 py-2.5 text-center w-24"
                  type="submit"
                >
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
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                  Add
                </Button>
              </Link>
            </Stack>
          </div>
          <div className="mx-auto w-full md:w-[800px] lg:w-[1000px]">
            <Stack>
              {/* <Box className="w-full pt-4 pl-4 flex justify-center mb-2"> */}
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow className="bg-sky-600 border-b ">
                      <TableCell className=" font-bold text-white" align="left">
                        #
                      </TableCell>
                      <TableCell className=" font-bold text-white" align="left">
                        Name
                      </TableCell>
                      <TableCell className=" font-bold text-white" align="left">
                        Role
                      </TableCell>
                      <TableCell className=" font-bold text-white" align="left">
                        Department
                      </TableCell>
                      <TableCell className=" font-bold text-white" align="left">
                        Contact
                      </TableCell>
                      <TableCell className=" font-bold text-white" align="left">
                        Active
                      </TableCell>
                      <TableCell className=" font-bold text-white">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers?.data.map((user) => {
                      return (
                        <TableRow
                          className="text-black odd:bg-[#FFFFFF] even:bg-sky-100 border-b"
                          key={user.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell className="px-4 py-1 text-sm" align="left">
                            {SrNo++}
                          </TableCell>
                          <TableCell>
                            <ul>
                              <li>{user.name}</li>
                              <li className="text-red-500">{user.email}</li>
                              <li className="text-slate-700">{user.tel_ext}</li>
                              <li className="text-sky-600">
                                {user.designation.name}
                              </li>
                            </ul>
                          </TableCell>
                          <TableCell className="px-4 py-1 text-sm" align="left">
                            <ul>
                              {user.roles.map((role) => {
                                return <li key={role.id}>{role.name}</li>;
                              })}
                            </ul>
                          </TableCell>
                          <TableCell className="px-4 py-1 text-sm" align="left">
                            {user.department.name}
                          </TableCell>
                          <TableCell>
                            <ul>
                              <li className="text-slate-700">{user.phone}</li>
                              <li className="text-red-500">
                                {user.employee_id}
                              </li>
                            </ul>
                          </TableCell>
                          <TableCell className="px-4 py-1 text-sm">
                            <Switch
                              checked={userActiveStatus[user.id]} // Use local state for active status
                              onChange={() => handleToggleActive(user.id)} // Handle toggle event
                            />
                          </TableCell>

                          <TableCell className=" my-8 ">
                            <EditButton
                              link={`/users/userUpdate/${user.id}`}
                              router={router}
                            />

                            <DeleteButton
                              link={`/users/delete/${user.id}`}
                              category="user"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="flex justify-between md:ml-10 md:mr-10">
                  <div className="ml-4 md:ml-0">
                    No. of records found {filteredUsers?.meta.itemCount}
                  </div>
                  <div className="mr-4 md:mr-0">
                    No. of pages {filteredUsers?.meta.pageCount}
                  </div>
                </div>
              </TableContainer>
              <div className="flex md:justify-between p-4">
                <Stack container spacing={1} className=" md:mr-34">
                  <FiltersControls
                    control="take"
                    setPagedata={setFilteredUsers}
                    filteringData={fetchFilteredData}
                    currentTake={currentTake}
                    searchParams={searchParams}
                    replace={router.replace}
                  />
                </Stack>
                <Stack container spacing={1} className="ml-0 md:ml-28">
                  <FiltersControls
                    control="page"
                    pagination={filteredUsers?.meta}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    setPagedata={setFilteredUsers}
                    searchParams={searchParams}
                    replace={router.replace}
                    filteringData={fetchFilteredData}
                  />
                </Stack>
              </div>
            </Stack>
          </div>
        </div>
      </div>
    </Layoutt>
  );
}

export default users;

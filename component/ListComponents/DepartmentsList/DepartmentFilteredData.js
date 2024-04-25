import axios from "axios";
import { getSession } from "next-auth/react";
import useAxiosAuth from "../../../lib/hooks/useAxiosAuth";

async function fetchDepartmentFilteredData(data, searchParams, replace) {
  const params = new URLSearchParams(searchParams);
  const session = await getSession();
  if (data) {
    if (data.search) {
      params.set("search", data.search);
      params.set("page", 1);
    }
    if (data.order) {
      params.set("order", data.order);
      params.set("page", 1);
    }
    if (data.orderBy) {
      params.set("orderBy", data.orderBy);
      params.set("page", 1);
    }
    if (data.take) {
      params.set("take", data.take);
      params.set("page", 1);
    }
    if (data.page) {
      params.set("page", data.page);
    }
  }
  if (!data.search) {
    params.delete("search");
  }

  if (!data.order) {
    params.delete("order");
  }
  if (!data.orderBy) {
    params.delete("orderBy");
  }
  const res = await axios.get(`/departments/pagedata?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });
  replace(`/department/list?${params.toString()}`);
  return res.data;
}

export default fetchDepartmentFilteredData;

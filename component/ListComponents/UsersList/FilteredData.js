import axios from "axios";
// import useAxiosAuth from "../../../lib/hooks/useAxiosAuth";
import { getSession } from "next-auth/react";

async function fetchFilteredData(data, searchParams, replace) {
  const params = new URLSearchParams(searchParams);
  const session = await getSession();

  if (data) {
    if (data.search) {
      params.set("search", data.search);
      params.set("page", 1);
    }

    if (data.roles) {
      params.set("roles", data.roles);
      params.set("page", 1);
    }
    if (data.department) {
      params.set("department", data.department);
      params.set("page", 1);
    }
    if (data.designation) {
      params.set("designation", data.designation);
      params.set("page", 1);
    }
    if (data.status) {
      params.set("status", data.status);
      params.set("page", 1);
    }
    if (data.orderBy) {
      params.set("orderBy", data.orderBy);
      params.set("page", 1);
    }
    if (data.order) {
      params.set("order", data.order);
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

  if (!data.roles) {
    params.delete("roles");
  }

  if (!data.department) {
    params.delete("department");
  }

  if (!data.designation) {
    params.delete("designation");
  }
  if (!data.status) {
    params.delete("status");
  }
  if (!data.order) {
    params.delete("order");
  }
  if (!data.orderBy) {
    params.delete("orderBy");
  }

  const res = await axios.get(`/users/pagedata?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });
  replace(`/users/list?${params.toString()}`);

  return res.data.pagedata;
}

export default fetchFilteredData;

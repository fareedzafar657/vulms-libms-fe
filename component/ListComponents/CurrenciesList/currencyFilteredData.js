import axios from "axios";
import { getSession } from "next-auth/react";

async function fetchCurrencyFilteredData(data, searchParams, replace) {
  const params = new URLSearchParams(searchParams);

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
  const session = await getSession();

  const res = await axios.get(`/currencies/pagedata?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });
  replace(`/currencies/list?${params.toString()}`);

  return res.data;
}

export default fetchCurrencyFilteredData;

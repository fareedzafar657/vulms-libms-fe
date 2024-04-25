import axios from "axios";
import { getSession } from "next-auth/react";

async function fetchcategoryFilteredData(data, searchParams, replace) {
  const params = new URLSearchParams(searchParams);

  if (data) {
    if (data.take) {
      params.set("take", data.take);
      params.set("page", 1);
    }
    if (data.page) {
      params.set("page", data.page);
    }
  }
  const session = await getSession();

  const res = await axios.get(`/categories/pagedata?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });
  replace(`/categories?${params.toString()}`);

  return res.data;
}

export default fetchcategoryFilteredData;

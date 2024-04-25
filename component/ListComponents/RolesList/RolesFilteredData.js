import axios from "axios";

async function fetchRolesFilteredData(data, searchParams, replace) {
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

  const res = await axios.get(`/roles/pagedata?${params.toString()}`);
  replace(`/listofroles?${params.toString()}`);

  return res.data;
}

export default fetchRolesFilteredData;

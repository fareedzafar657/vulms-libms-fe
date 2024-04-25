import axios from "axios";
import { getSession } from "next-auth/react";

async function fetchNovelsFilteredData(data, searchParams, replace) {
  const params = new URLSearchParams(searchParams);

  if (data) {
    if (data.search) {
      params.set("search", data.search);
      params.set("page", 1);
    }
    if (data.location) {
      params.set("location", data.location);
      params.set("page", 1);
    }
    if (data.material_type) {
      params.set("material_type", data.material_type);
      params.set("page", 1);
    }
    if (data.language) {
      params.set("language", data.language);
      params.set("page", 1);
    }
    if (data.department) {
      params.set("department", data.department);
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
    if (data.availability) {
      params.set("status", data.availability);
      params.set("page", 1);
    }
    if (data.newArrival) {
      params.set("newArrival", data.newArrival);
      params.set("page", 1);
    }
    if (data.page) {
      params.set("page", data.page);
    }
  }

  if (!data.search) {
    params.delete("search");
  }
  if (!data.location) {
    params.delete("location");
  }
  if (!data.material_type) {
    params.delete("material_type");
  }
  if (!data.language) {
    params.delete("language");
  }
  if (!data.department) {
    params.delete("department");
  }
  if (!data.orderBy) {
    params.delete("orderBy");
  }
  if (!data.order) {
    params.delete("order");
  }
  if (!data.availability) {
    params.delete("status");
  }
  if (!data.newArrival) {
    params.delete("newArrival");
  }

  const session = await getSession();
  const res = await axios.get(`/novels/pagedata?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });
  replace(`/novels/list?${params.toString()}`);

  return res.data.pagedata;
}

export default fetchNovelsFilteredData;

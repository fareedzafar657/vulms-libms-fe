import axios from "axios";
import { getSession } from "next-auth/react";

async function fetchebooksFilteredData(data, searchParams, replace) {
  const params = new URLSearchParams(searchParams);
  const session = await getSession()

  if (data) {
    if (data.search) {
      params.set("search", data.search);
      params.set("page", 1);
    }
    if (data.department) {
      params.set("department", data.department);
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

    if (data.order) {
      params.set("order", data.order);
      params.set("page", 1);
    }
    if (data.orderBy) {
      params.set("orderBy", data.orderBy);
      params.set("page", 1);
    }

    if (data.availability) {
      params.set("availability", data.availability);
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

  if (!data.material_type) {
    params.delete("material_type");
  }
  if (!data.language) {
    params.delete("language");
  }

  if (!data.orderBy) {
    params.delete("orderBy");
  }
  if (!data.order) {
    params.delete("order");
  }
  if (!data.availability) {
    params.delete("availability");
  }

  const res = await axios.get(`/ebooks/pagedata?${params.toString()}` , {
    headers: {
      Authorization: `Bearer ${session?.user.access_token}`
    }
  });
  replace(`/ebooks/list?${params.toString()}`);

  return res.data.pageData;
}

export default fetchebooksFilteredData;

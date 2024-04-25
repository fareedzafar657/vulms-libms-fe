//useAxiosAuth.ts
"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";

export const axiosAuth = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

const useAxiosAuth = () => {
  const { data: session } = useSession();
  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use((config) => {
      if (!config.headers["Authorization"]) {
        config.headers[
          "Authorization"
        ] = `Bearer ${session?.user.access_token}`;
      }
      return config;
    });
    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
    };
  }, [session]);
  return axiosAuth;
};

export default useAxiosAuth;

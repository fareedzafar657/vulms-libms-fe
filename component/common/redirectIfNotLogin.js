import React from "react";
import { useRouter } from "next/router";

function redirectIfNotLogin() {
  const router = useRouter();
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId === undefined || userId == null || userId.length < 1) {
      router.push("/login");
    } else {
      router.push("/master");
    }
  });

  return <></>;
}

export default redirectIfNotLogin;

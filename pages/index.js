//index.js Main Landing Page
import { React, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layoutt from "../component/lay/Layoutt";
import Dashboard from "../component/dashboard/user";
import { getSession } from "next-auth/react";
import Librarian from "../component/librarian/Librarian";

function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(false);
  const [librarian, setLibrarian] = useState(false);

  useEffect(() => {
    const loggedIn = async () => {
      const session = await getSession();
      const roles = session?.user?.user?.roles?.map((role) => role.name);
      if (roles) {
        const userRole = roles?.map((role) => {
          if (role === "user") {
            setUser(true);
          }
        });
        const librarianRole = roles?.map((role) => {
          if (role === "librarian") {
            setLibrarian(true);
          }
        });
      }

      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };
    loggedIn();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layoutt>
      <>
        <div className="mt-0 pt-2 ">
          {user && librarian ? (
            <Librarian />
          ) : user ? (
            <Dashboard />
          ) : librarian ? (
            <Librarian />
          ) : null}
        </div>
      </>
    </Layoutt>
  );
}
export default Home;

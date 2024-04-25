//_app.tsx
import "@/styles/globals.css";
import axios from "axios";
import Providers from "../component/Providers";

export default function App({ Component, pageProps }) {
  axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_BE_URL}`; //pm-server
  // axios.defaults.baseURL = "http://localhost:4001"; //local-host
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.timeout = 5000;

  // axios.defaults.headers.common[
  //   "Authorization"
  // ] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5OTE2ZDdiYy1mZjA3LTRjNjItYWZjMS1jYjhjOGE4OGEzYjYiLCJ1c2VyIjp7ImlkIjoiOTkxNmQ3YmMtZmYwNy00YzYyLWFmYzEtY2I4YzhhODhhM2I2IiwiZW1haWwiOiJzYXdhbkB2dS5lZHUucGsiLCJ1c2VybmFtZSI6InNhd2FuIiwicGhvbmUiOiI5MjMzMzQ5NDc1OTQiLCJyb2xlcyI6W3siaWQiOiI5NGY3YjVhMy1kYzIzLTRkNmQtYjAyNC1kMDI0YzFhZTM0OWEiLCJuYW1lIjoiYWRtaW4ifSx7ImlkIjoiY2M3YjMyYzEtYmI1Yy00YjkxLWFkMzktNWYzNzk1M2RkNzcyIiwibmFtZSI6InVzZXIifV19LCJpYXQiOjE3MDU2NjMzNzUsImV4cCI6MzUwNTY2MzM3NX0.XVM_mfk02teCQy72rl0C5u5CD5Sr9V-dx_0IGYxNo7A`;

  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}

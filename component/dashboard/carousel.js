// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import Image from "next/image";
// import { useState } from "react";
// import React, { useEffect } from "react";
// import { getSession } from "next-auth/react";
// import axios from "axios";
// import { Stack } from "@mui/material";
// import { Photo } from "@mui/icons-material";

// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";

// const CarouselComponent = (assets) => {
//   const [getTenNewArrivals, setgetTenNewArrivals] = useState([]);

//   useEffect(() => {
//     const api = async () => {
//       const session = await getSession();
//       ("");

//       axios
//         .get(
//           "/assets/borrowerDashboard",

//           {
//             headers: {
//               Authorization: `Bearer ${session?.user.access_token}`,
//             },
//           }
//         )
//         .then((res) => {
//           const { getTenNewArrivals } = res.data;

//           setgetTenNewArrivals(getTenNewArrivals);
//         })
//         .catch((err) => console.error(err));
//     };
//     api();
//   }, []);

//   const bull = (
//     <Box
//       component="span"
//       sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
//     >
//       •
//     </Box>
//   );

//   return (
//     <Carousel
//       showArrows={true}
//       infiniteLoop={true}
//       showThumbs={false}
//       showStatus={false}
//       autoPlay={false}
//       interval={5000}
//       renderArrowPrev={(onClickHandler, hasPrev, label) =>
//         hasPrev && (
//           <button
//             type="button"
//             onClick={onClickHandler}
//             title={label}
//             className="absolute z-10 top-1/2 left-4 transform -translate-y-1/2 bg-sky-600 bg-opacity-50 rounded-full p-2 text-white"
//             style={{ zIndex: 1000, fontSize: "1.5em" }}
//           >
//             &lsaquo;
//           </button>
//         )
//       }
//       renderArrowNext={(onClickHandler, hasNext, label) =>
//         hasNext && (
//           <button
//             type="button"
//             onClick={onClickHandler}
//             title={label}
//             className="absolute z-10 top-1/2 right-4 transform -translate-y-1/2 bg-sky-600 bg-opacity-50 rounded-full p-2 text-white"
//             style={{ zIndex: 1000, fontSize: "1.5em" }}
//           >
//             &rsaquo;
//           </button>
//         )
//       }
//     >
//       {getTenNewArrivals.reduce((slides, asset, index) => {
//         if (index % 5 === 0) {
//           slides.push(
//             <div key={index} className="flex justify-center">
//               {getTenNewArrivals.slice(index, index + 5).map((asset, i) => (
//                 <div className=" bg-grey-100 p-2 m-2 pb-2 mb-2 border-2 rounded-lg shado">
//                   <Card key={i} sx={{ minWidth: 175 }}>
//                     <CardContent className="">
//                       <div className="max-w-sm pt-1 pl-4">
//                         <div className="w-[100px] h-[150px] text-center rounded-md">
//                           <img
//                             src={`${process.env.NEXT_PUBLIC_BE_URL}${asset.cover}`}
//                             alt="image"
//                             className="selected-image"
//                             style={{ width: "100px", height: "150px" }}
//                           />
//                         </div>
//                       </div>
//                     </CardContent>
//                     <div>
//                       <ul>
//                         <li>
//                           <div className="font-bold text-center mt-1">
//                             {asset.title}
//                           </div>
//                           {/* <div className="font-bold">{asset.subTitle}</div> */}
//                         </li>
//                       </ul>
//                     </div>
//                   </Card>
//                 </div>
//               ))}
//             </div>
//           );
//         }
//         return slides;
//       }, [])}
//     </Carousel>
//   );
// };

// export default CarouselComponent;
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import axios from "axios";
import { Stack } from "@mui/material";
import { Fullscreen, Photo } from "@mui/icons-material";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const CarouselComponent = (assets) => {
  const [getTenNewArrivals, setgetTenNewArrivals] = useState([]);

  useEffect(() => {
    const api = async () => {
      const session = await getSession();

      axios
        .get(
          "/assets/borrowerDashboard",

          {
            headers: {
              Authorization: `Bearer ${session?.user.access_token}`,
            },
          }
        )
        .then((res) => {
          const { getTenNewArrivals } = res.data;

          setgetTenNewArrivals(getTenNewArrivals);
        })
        .catch((err) => console.error(err));
    };
    api();
  }, []);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Carousel
        showArrows={true}
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        autoPlay={false}
        interval={5000}
      >
        {getTenNewArrivals.reduce((slides, asset, index) => {
          if (index % 5 === 0) {
            slides.push(
              <div key={index} className="flex justify-center">
                {getTenNewArrivals.slice(index, index + 5).map((asset, i) => (
                  <div className=" bg-grey-100 p-2 m-2 pb-2 mb-2 border-2 rounded-lg shado">
                    <Card key={i} sx={{ minWidth: 175 }}>
                      <CardContent className="">
                        <div className="max-w-sm pt-1 pl-4">
                          <div className="w-[100px] h-[150px] text-center rounded-md">
                            <img
                              src={`${process.env.NEXT_PUBLIC_BE_URL}${asset.cover}`}
                              alt="image"
                              className="selected-image"
                              style={{ width: "100px", height: "150px" }}
                            />
                          </div>
                        </div>
                      </CardContent>
                      <div>
                        <ul>
                          <li>
                            <div className="font-bold text-center mt-1">
                              {asset.title}
                            </div>
                            {/* <div className="font-bold">{asset.subTitle}</div> */}
                          </li>
                        </ul>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            );
          }
          return slides;
        }, [])}
      </Carousel>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          transform: "translateY(-50%)",
        }}
      >
        <button
          type="button"
          className="bg-sky-600 bg-opacity-50  p-2 text-white"
          style={{ zIndex: 1000, fontSize: "1.5em", height: "240px" }}
        >
          &lsaquo;
        </button>
      </div>
      <div
        className="bg-sky-600 rounded-full"
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
        }}
      >
        <button
          type="button"
          className="bg-sky-600 bg-opacity-50   p-2 text-white"
          style={{ zIndex: 1000, fontSize: "1.5em", height: "240px" }}
        >
          &rsaquo;
        </button>
      </div>
    </div>
  );
};

export default CarouselComponent;

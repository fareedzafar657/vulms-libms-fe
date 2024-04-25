import React from "react";
import { Oval } from "react-loader-spinner";

function FromLoader() {
  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "0",
    height: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.8)",
    zIndex: 99999,
  };

  return (
    <div style={style} className="bg-orange-200 p-5 rounded-md">
      <Oval
        height="120"
        width="120"
        ariaLabel="progress-bar-loading"
        wrapperStyle={{}}
        wrapperClass="progress-bar-wrapper"
        borderColor="#F4442E"
        barColor="#51E5FF"
      />
    </div>
  );
}

export default FromLoader;

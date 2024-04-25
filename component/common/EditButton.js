import { Button } from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";

function EditButton(props) {
  const { router, link } = props;
  return (
    <EditIcon
      className="text-sky-600  transition duration-300 ease-in-out transform hover:scale-110 hover:text-sky-400 focus:ring-4 focus:ring-sky-200"
      variant="text"
      style={{ cursor: "pointer" }}
      onClick={() => router.push(link)}
    />
  );
}

export default EditButton;

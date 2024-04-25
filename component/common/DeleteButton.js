import Swal from "sweetalert2";
import axios from "axios";
import React from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

function DeleteButton(props) {
  const { link, category } = props;
  const router = useRouter();

  const deleteToDo = async (link) => {
    const session = await getSession();

    Swal.fire({
      title: `Do you want to delete this ${category}?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      focusCancel: true,
      icon: "warning",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(link, {
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
          },
        });
        Swal.fire("Deleted!", "", "success");
        router.reload();
      }
    });
  };

  return (
    <DeleteIcon
      className="text-sky-600  transition duration-300 ease-in-out transform hover:scale-110 hover:text-sky-400 focus:ring-4 focus:ring-sky-200"
      variant="text"
      style={{ cursor: "pointer" }}
      onClick={() => {
        deleteToDo(link);
      }}
    >
      {<DeleteIcon />}
    </DeleteIcon>
  );
}

export default DeleteButton;

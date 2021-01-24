import React from "react";
import { ButtonProps } from "@material-ui/core";

import Button from "./Button";

import { alert } from "../slices/snackbarsSlice";
import { useAppDispatch } from "../store";

export interface UploadButtonProps {
  files: File[];
}

export default function UploadButton<C extends React.ElementType>(
  props: ButtonProps<C, { component?: C }>
) {
  const dispatch = useAppDispatch();

  return (
    <Button
      {...props}
      onClick={() => {
        dispatch(alert({ message: "No files to upload!", severity: "error" }));
      }}
    />
  );
}

import React from "react";
import { ButtonProps } from "@material-ui/core";

import Button from "./Button";

import { alert } from "../slices/snackbarsSlice";
import { useAppDispatch } from "../store";
import { SelectedFile } from "../lib/interfaces";
import { uploadFile } from "../lib/upload";

export type UploadButtonProps = {
  selectedFiles: SelectedFile[];
  setSelectedFiles: (selectedFiles: SelectedFile[]) => void;
} & ButtonProps;

export default function UploadButton(props: UploadButtonProps) {
  const { selectedFiles, setSelectedFiles, ...rest } = props;
  const dispatch = useAppDispatch();

  const onClick = () => {
    if (selectedFiles.length === 0) {
      dispatch(alert({ message: "No files to upload!", severity: "error" }));
    } else {
      selectedFiles.forEach((file, i) => {
        const setFile = (editedFile: SelectedFile) => {
          let newSelectedFiles = [...selectedFiles];
          newSelectedFiles[i] = editedFile;
          setSelectedFiles(newSelectedFiles);
        };

        uploadFile(file, setFile);
      });
    }
  };

  return <Button {...rest} onClick={onClick} />;
}

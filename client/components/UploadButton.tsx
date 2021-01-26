import React from "react";
import { ButtonProps } from "@material-ui/core";

import Button from "./Button";

import { alert } from "../slices/snackbarsSlice";
import { useAppDispatch } from "../store";
import { SelectedFile } from "../lib/interfaces";
import { uploadFile } from "../lib/upload";

export type UploadButtonProps = {
  selectedFiles: SelectedFile[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<SelectedFile[]>>;
  hideDropzone: () => void;
} & ButtonProps;

export default function UploadButton(props: UploadButtonProps) {
  const { selectedFiles, setSelectedFiles, hideDropzone, ...rest } = props;
  const dispatch = useAppDispatch();

  const onClick = () => {
    if (selectedFiles.length === 0) {
      dispatch(alert({ message: "No files to upload!", severity: "error" }));
    } else {
      hideDropzone();
      
      setSelectedFiles((selectedFiles) =>
        selectedFiles.map((file) => ({ ...file, status: "pending" }))
      );

      selectedFiles.forEach((file, i) => {
        const setFile = (editedFile: SelectedFile) => {
          setSelectedFiles((selectedFiles: SelectedFile[]) => {
            let newSelectedFiles = [...selectedFiles];
            newSelectedFiles[i] = editedFile;
            return newSelectedFiles;
          });
        };

        uploadFile(file, setFile);
      });
    }
  };

  return <Button {...rest} onClick={onClick} />;
}

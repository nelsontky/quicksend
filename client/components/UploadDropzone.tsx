import React from "react";
import { useDropzone } from "react-dropzone";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { bytesToMb } from "../lib/utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
    },
    dropzone: {
      textAlign: "center",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      borderWidth: "2px",
      borderRadius: "2px",
      borderColor: "#eeeeee",
      borderStyle: "dashed",
      backgroundColor: "fafafa",
      outline: "none",
      transition: "border .24s ease-in-out",
      "&:focus": {
        borderColor: theme.palette.secondary.main,
      },
    },
    dropzoneDisabled: {
      opacity: 0.6,
    },
    files: {
      width: "100%",
      maxHeight: theme.spacing(15),
      overflowY: "scroll",
      overflowWrap: "break-word",
      wordWrap: "break-word",
      MsWordBreak: "break-all",
      wordBreak: "break-word",
      MsHyphens: "auto",
      MozHyphens: "auto",
      WebkitHyphens: "auto",
      hyphens: "auto",
    },
  })
);

export interface IUpload {
  onSelect: (acceptedFiles: File[]) => void;
  [x: string]: any;
}

export default function UploadDropzone({ onSelect, ...rest }: IUpload) {
  const classes = useStyles();
  const onDrop = React.useCallback(onSelect, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {bytesToMb(file.size)} MB
    </li>
  ));

  return (
    <section className={clsx(classes.container, rest.className)}>
      <div {...getRootProps({ className: classes.dropzone })}>
        <input {...getInputProps()} />
        <p>Drag and drop some files here, or click to select files</p>
      </div>
      {acceptedFiles.length > 0 && (
        <div className={classes.files}>
          <h4>Selected Files</h4>
          <ul>{files}</ul>
        </div>
      )}
    </section>
  );
}

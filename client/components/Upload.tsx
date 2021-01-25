import React from "react";
import { useDropzone } from "react-dropzone";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { DialogTitle, DialogContent } from "@material-ui/core";

import { bytesToMb } from "../lib/utils";
import ClosableDialog from "./ClosableDialog";
import Typography from "./Typography";
import { SelectedFile } from "../lib/interfaces";
import SelectedFiles from "./upload-dropzone/SelectedFiles";
import UploadButton from "./UploadButton";

interface StylesProps {
  isDragActive: boolean;
}

const useStyles = makeStyles<Theme, StylesProps>((theme: Theme) =>
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
      borderColor: (props) =>
        props.isDragActive ? theme.palette.secondary.main : "#eeeeee",
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
    errorDialog: {
      width: "600px",
    },
    button: {
      minWidth: 200,
    },
  })
);

export default function UploadDropzone(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
) {
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDropRejected: () => {
      setIsOpen(true);
    },
    // maxSize: 4 * 1024 * 1024 * 1024,
    maxSize: 1 * 1024 * 1024,
  });

  const classes = useStyles({ isDragActive });

  const [selectedFiles, setSelectedFiles] = React.useState<SelectedFile[]>();

  React.useEffect(() => {
    setSelectedFiles(
      acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: "selected",
      }))
    );
  }, [acceptedFiles]);

  return (
    <>
      <ClosableDialog
        classes={{ paper: classes.errorDialog }}
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <DialogTitle>File size exceeded!</DialogTitle>
        <DialogContent>
          <Typography>
            The following files exceed the max file size of 4GB:
          </Typography>
          <ul>
            {fileRejections.map((error) => (
              <li key={error.file.path}>
                {error.file.path} - {bytesToMb(error.file.size)} MB
              </li>
            ))}
          </ul>
        </DialogContent>
      </ClosableDialog>
      <section className={clsx(classes.container, props.className)}>
        <div {...getRootProps({ className: classes.dropzone })}>
          <input {...getInputProps()} />
          <p>Drag and drop some files here, or click to select files</p>
          <span>(Max file size: 4GB)</span>
        </div>
        {acceptedFiles.length > 0 && (
          <div className={classes.files}>
            <h4>Selected Files</h4>
            <SelectedFiles selectedFiles={selectedFiles} />
          </div>
        )}
      </section>
      <UploadButton
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        color="secondary"
        variant="contained"
        size="large"
        className={classes.button}
      >
        Upload Now
      </UploadButton>
    </>
  );
}

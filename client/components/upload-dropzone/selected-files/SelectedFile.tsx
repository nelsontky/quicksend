import { LinearProgress } from "@material-ui/core";
import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import { SelectedFile as ISelectedFile } from "../../../lib/interfaces";
import { bytesToMb } from "../../../lib/utils";
import Typography from "../../Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    hideProgress: {
      visibility: "hidden",
    },
    errorText: {
      color: theme.palette.error.main,
    },
  })
);

export type SelectedFileProps = {
  selectedFile: ISelectedFile;
} & React.DetailedHTMLProps<
  React.LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
>;

export default function SelectedFile({
  selectedFile,
  ...rest
}: SelectedFileProps) {
  const classes = useStyles();

  return (
    <li {...rest} className={clsx(classes.root, rest.className)}>
      <span>
        {selectedFile.file.name} - {bytesToMb(selectedFile.file.size)} MB
      </span>
      <LinearProgress
        className={clsx(
          selectedFile.status !== "uploading" && classes.hideProgress
        )}
        variant="determinate"
        color="secondary"
        value={selectedFile.progress}
      />
      {selectedFile.status === "pending" && (
        <Typography variant="caption">Loading...</Typography>
      )}
      {selectedFile.status === "error" && (
        <Typography className={classes.errorText} variant="caption">
          An error has occurred. Please try uploading again later.
        </Typography>
      )}
    </li>
  );
}

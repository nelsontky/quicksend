import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Grid, IconButton } from "@material-ui/core";
import { FileCopyTwoTone as FileCopyIcon } from "@material-ui/icons";

import Button from "./Button";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "table",
      width: "100%",
    },
    icon: {
      color: theme.palette.grey[500],
    },
    input: {
      borderTopRightRadius: "0",
      borderBottomRightRadius: "0",
      position: "relative",
      width: "100%",
      minHeight: "34px",
      padding: "7px 8px",
      fontSize: "13px",
      color: "#333",
      verticalAlign: "middle",
      backgroundColor: "#fff",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 8px center",
      border: "1px solid #ccc",
      borderRadius: "3px",
      outline: "none",
      boxShadow: "inset 0 1px 2px rgb(0 0 0 / 8%)",
    },
  })
);

export default function InputCopy(
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) {
  const classes = useStyles();

  return (
    <Grid container alignItems="center">
      <Grid item xs={10}>
        <input
          className={classes.input}
          type="text"
          value="https://github.com/zenorocha/clipboard.js.git"
        ></input>
      </Grid>
      <Grid item xs={2}>
        <IconButton>
          <FileCopyIcon className={classes.icon} />
        </IconButton>
      </Grid>
    </Grid>
  );
}

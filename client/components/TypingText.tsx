import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { Box } from "@material-ui/core";

import Typography from "./Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typewriter: {
      overflow: "hidden",
      borderRight: `.1em solid ${theme.palette.secondary.main}`,
      whiteSpace: "nowrap",
      margin: "0 auto",
      animation: `$typing 2s steps(25, end), $blinkCaret .75s step-end ${
        2 / 0.75
      };`,
    },
    "@keyframes typing": {
      from: { width: 0 },
      to: { width: "100%" },
    },
    "@keyframes blinkCaret": {
      "from, to": { borderColor: "transparent" },
      "50%": { borderColor: theme.palette.secondary.main },
    },
  })
);

export interface TypingTextProps {
  [x: string]: any;
}

export default function TypingText(props: TypingTextProps) {
  const classes = useStyles();

  return (
    <Box display="flex">
      <Typography
        {...props}
        className={clsx(props.className, classes.typewriter)}
      />
    </Box>
  );
}

import * as React from "react";
import { AppBarProps, WithStyles } from "@material-ui/core";
import { withStyles, Theme } from "@material-ui/core/styles";
import AppBar from "./app-app-bar/AppBar";
import Toolbar, { styles as toolbarStyles } from "./app-app-bar/Toolbar";

import Link from "./Link";
import Typography from "./Typography";

const styles = (theme: Theme) => ({
  title: {
    fontSize: 24,
  },
  placeholder: toolbarStyles(theme).root,
  toolbar: {
    justifyContent: "space-between",
  },
  leftLinkActive: {
    color: theme.palette.common.white,
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
  },
  rightLink: {
    fontSize: 16,
    color: theme.palette.common.white,
    marginLeft: theme.spacing(3),
    cursor: "not-allowed",
  },
  linkSecondary: {
    color: theme.palette.secondary.main,
  },
  comingSoon: {
    color: theme.palette.secondary.main,
  },
});

function AppAppBar(props: WithStyles<typeof styles> & AppBarProps) {
  const { classes } = props;

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <Link
            variant="h6"
            underline="none"
            color="inherit"
            className={classes.title}
            href="/"
          >
            QUICKSEND
          </Link>
          <div className={classes.right}>
            <Typography
              variant="h6"
              underline="none"
              className={classes.rightLink}
            >
              {"Sign In/Sign up"}
              <sup className={classes.comingSoon}>Coming soon!</sup>
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.placeholder} />
    </div>
  );
}

export default withStyles(styles)(AppAppBar);

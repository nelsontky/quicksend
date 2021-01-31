import * as React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "./Typography";

import Link from "./Link";

function Copyright() {
  return (
    <React.Fragment>
      {"© "}
      Quick Send {new Date().getFullYear()}
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    backgroundColor: theme.palette.secondary.light,
  },
  container: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: "flex",
  },
  iconsWrapper: {
    height: 120,
  },
  icons: {
    display: "flex",
  },
  icon: {
    width: 48,
    height: 48,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.warning.main,
    marginRight: theme.spacing(1),
    "&:hover": {
      backgroundColor: theme.palette.warning.dark,
    },
  },
  list: {
    margin: 0,
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  language: {
    marginTop: theme.spacing(1),
    width: 150,
  },
}));

export default function AppFooter() {
  const classes = useStyles();

  return (
    <Typography component="footer" className={classes.root}>
      <Container className={classes.container}>
        <Grid container direction="column" spacing={2}>
          <Grid item container spacing={5}>
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="h6" marked="left" gutterBottom>
                Legal
              </Typography>
              <ul className={classes.list}>
                <li className={classes.listItem}>
                  <Link href="/terms">Terms</Link>
                </li>
                <li className={classes.listItem}>
                  <Link
                    target="_blank"
                    rel="noreferrer noopener"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSf9gFrlaKz4RVdnBIeaOKhayISREwS3Kjr3dNPknFgGgLQd1w/viewform"
                  >
                    Report Abuse
                  </Link>
                </li>
              </ul>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="h6" marked="left" gutterBottom>
                Information
              </Typography>
              <ul className={classes.list}>
                <li className={classes.listItem}>
                  <Link href="/faq">FAQ</Link>
                </li>
              </ul>
            </Grid>
          </Grid>
          <Grid item>
            <Copyright />
          </Grid>
        </Grid>
      </Container>
    </Typography>
  );
}

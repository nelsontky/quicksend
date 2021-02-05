import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { CacheProvider } from "@emotion/react";
import { CssBaseline, Grid } from "@material-ui/core";
import createCache from "@emotion/cache";
import {
  ThemeProvider,
  createStyles,
  Theme,
  makeStyles,
} from "@material-ui/core/styles";
import { Provider } from "react-redux";
import axios from "axios";

import AppAppBar from "../components/AppAppBar";
import AppFooter from "../components/AppFooter";

import Snackbars from "../components/Snackbars";

import theme from "../lib/theme";
import store from "../store";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexContainer: {
      minHeight: "calc(100vh - 64px)",
      [theme.breakpoints.up("sm")]: {
        minHeight: "calc(100vh - 70px)",
      },
    },
  })
);

export const cache = createCache({ key: "css", prepend: true });

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  // Will be manually overridden in backend calls
  axios.defaults.baseURL = "/api/v1";

  const classes = useStyles();
  return (
    <CacheProvider value={cache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Snackbars />
          <AppAppBar />
          <Grid className={classes.flexContainer} container direction="column">
            <Grid item>
              <Component {...pageProps} />
            </Grid>
            <AppFooter />
          </Grid>
        </ThemeProvider>
      </Provider>
    </CacheProvider>
  );
}

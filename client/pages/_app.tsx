import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@material-ui/core/CssBaseline";
import createCache from "@emotion/cache";
import { ThemeProvider } from "@material-ui/core/styles";
import { Provider } from "react-redux";
import axios from "axios";

import Snackbars from "../components/Snackbars";

import theme from "../lib/theme";
import store from "../store";

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

  axios.defaults.baseURL =
    typeof window !== "undefined" ? "/api/v1" : "http://server:5000/api/v1";

  return (
    <CacheProvider value={cache}>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Snackbars />
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
    </CacheProvider>
  );
}

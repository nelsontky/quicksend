import * as React from "react";
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
  useTheme,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Typography from "./Typography";
import TypingText from "./TypingText";
import ProductHeroLayout from "./product-hero/ProductHeroLayout";
import Upload from "./Upload";

const styles = (theme: Theme) =>
  createStyles({
    background: {
      backgroundImage: `url(/images/sand.jpg)`,
      backgroundColor: "#7fc7d9", // Average color of the background image.
      backgroundPosition: "center",
    },
    h5: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    upload: {
      marginBottom: theme.spacing(2),
      width: "50%",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
      },
    },
  });

function ProductHero(props: WithStyles<typeof styles>) {
  const { classes } = props;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <img
        style={{ display: "none" }}
        src="/images/sand.jpg"
        alt="increase priority"
      />
      {matches ? (
        <Typography color="inherit" align="center" variant="h2" marked="center">
          Send your files quickly
        </Typography>
      ) : (
        <TypingText color="inherit" align="center" variant="h2" marked="center">
          Send your files quickly
        </TypingText>
      )}
      <Typography
        color="inherit"
        align="center"
        variant="h5"
        className={classes.h5}
      >
        Always fast. Always free. Always simple.
      </Typography>
      <Upload className={classes.upload} />
    </ProductHeroLayout>
  );
}

export default withStyles(styles)(ProductHero);

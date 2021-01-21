import * as React from "react";
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
} from "@material-ui/core/styles";
import Button from "./Button";
import Typography from "./Typography";
import ProductHeroLayout from "./product-hero/ProductHeroLayout";

const styles = (theme: Theme) =>
  createStyles({
    background: {
      backgroundImage: `url(/images/sand.jpg)`,
      backgroundColor: "#7fc7d9", // Average color of the background image.
      backgroundPosition: "center",
    },
    button: {
      minWidth: 200,
    },
    h5: {
      marginBottom: theme.spacing(4),
      marginTop: theme.spacing(4),
      [theme.breakpoints.up("sm")]: {
        marginTop: theme.spacing(10),
      },
    },
  });

function ProductHero(props: WithStyles<typeof styles>) {
  const { classes } = props;

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <img
        style={{ display: "none" }}
        src="/images/sand.jpg"
        alt="increase priority"
      />
      <Typography color="inherit" align="center" variant="h2" marked="center">
        Send your files quickly
      </Typography>
      <Typography
        color="inherit"
        align="center"
        variant="h5"
        className={classes.h5}
      >
        Always fast. Always free. Always Simple.
      </Typography>
      <Button
        color="secondary"
        variant="contained"
        size="large"
        className={classes.button}
        component="a"
        href="/premium-themes/onepirate/sign-up/"
      >
        Register
      </Button>
    </ProductHeroLayout>
  );
}

export default withStyles(styles)(ProductHero);

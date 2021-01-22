import * as React from "react";
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
} from "@material-ui/core/styles";

import Typography from "./Typography";
import TypingText from "./TypingText";
import ProductHeroLayout from "./product-hero/ProductHeroLayout";
import Upload from "./UploadDropzone";
import UploadButton from "./UploadButton";

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
      marginTop: theme.spacing(2),
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

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <img
        style={{ display: "none" }}
        src="/images/sand.jpg"
        alt="increase priority"
      />
      <TypingText color="inherit" align="center" variant="h2" marked="center">
        Send your files quickly
      </TypingText>
      <Typography
        color="inherit"
        align="center"
        variant="h5"
        className={classes.h5}
      >
        Always fast. Always free. Always Simple.
      </Typography>
      <Upload
        onSelect={(acceptedFiles) => {
          console.log("yay");
        }}
        className={classes.upload}
      />
      <UploadButton
        color="secondary"
        variant="contained"
        size="large"
        className={classes.button}
      >
        Upload Now
      </UploadButton>
    </ProductHeroLayout>
  );
}

export default withStyles(styles)(ProductHero);

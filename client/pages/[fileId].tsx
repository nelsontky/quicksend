import React from "react";
import { GetServerSideProps } from "next";
import axios from "axios";
import { Grid, Container } from "@material-ui/core";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

import { UploadedFile } from "../lib/interfaces";
import Typography from "../components/Typography";
import Captcha from "../components/Captcha";
import Button from "../components/Button";
import { bytesToMb } from "../lib/utils";

export interface DownloadProps {
  file: UploadedFile;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { height: "80vh" },
    fileName: {
      textAlign: "center",
      overflow: "hidden",
      overflowWrap: "anywhere",
    },
    title: {
      display: "-webkit-box",
      "-webkit-line-clamp": 3,
      "-webkit-box-orient": "vertical",
    },
    download: { textAlign: "center", marginTop: theme.spacing(5) },
    downloadButton: { marginBottom: theme.spacing(1) },
    downloadLink: { marginBottom: theme.spacing(1) },
  })
);

export default function Download(props: DownloadProps) {
  const classes = useStyles();
  const [section, setSection] = React.useState<"button" | "captcha" | "link">(
    "button"
  );
  const [downloadLink, setDownloadLink] = React.useState("");
  const linkRef = React.useCallback((node: HTMLAnchorElement) => {
    if (node) {
      node.click();
    }
  }, []);

  React.useEffect(() => {
    if (downloadLink.length > 0) {
      setSection("link");
    }
  }, [downloadLink]);

  const { id, name, size } = props.file;
  return (
    <Container fixed>
      <Grid
        container
        className={classes.root}
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item className={classes.fileName}>
          <Typography className={classes.title} variant="h2" marked="center">
            {name}
          </Typography>
        </Grid>
        <Grid item className={classes.download}>
          {section === "captcha" ? (
            <Captcha
              onVerify={(token) => {
                axios
                  .post(`/files/download/${id}`, {
                    hCaptchaResponse: token,
                  })
                  .then((res) => {
                    setDownloadLink(res.data);
                  });
              }}
            />
          ) : section === "button" ? (
            <Button
              className={classes.downloadButton}
              color="secondary"
              variant="contained"
              size="large"
              onClick={() => {
                setSection("captcha");
              }}
            >
              Download
            </Button>
          ) : (
            <Typography className={classes.downloadLink}>
              If your download doesn't start in a few seconds, click{" "}
              <a href={downloadLink} ref={linkRef}>
                here
              </a>{" "}
              to download.
            </Typography>
          )}

          <Typography variant="caption" component="p">{`${bytesToMb(
            +size
          )}MB`}</Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fileId } = context.params;

  try {
    const file = (await axios.get(`http://server:5000/api/v1/files/${fileId}`)).data;

    return {
      props: {
        file,
      },
    };
  } catch(error) {
       console.log('Error', error.message);
       console.log(error.config);
    context.res.writeHead(302, { Location: "/" });
    context.res.end();
    return {
      props: {},
    };
  }
};

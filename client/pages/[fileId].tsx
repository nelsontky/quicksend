import { GetServerSideProps } from "next";
import axios from "axios";
import { Grid, Container } from "@material-ui/core";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

import { UploadedFile } from "../lib/interfaces";
import Typography from "../components/Typography";
import Button from "../components/Button";
import { bytesToMb } from "../lib/utils";

export interface DownloadProps {
  file: UploadedFile;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { height: "80vh" },
    fileName: { textAlign: "center" },
    download: { textAlign: "center" },
    downloadButton: { marginBottom: theme.spacing(1) },
  })
);

export default function Download(props: DownloadProps) {
  const classes = useStyles();

  const { name, size } = props.file;
  return (
    <Container fixed>
      <Grid
        container
        className={classes.root}
        direction="column"
        justify="center"
        alignItems="center"
        spacing={5}
      >
        <Grid item className={classes.fileName}>
          <Typography variant="h2" marked="center">
            {name}
          </Typography>
        </Grid>
        <Grid item className={classes.download}>
          <Button
            className={classes.downloadButton}
            color="secondary"
            variant="contained"
            size="large"
          >
            Download
          </Button>
          <Typography>{`${bytesToMb(+size)}MB`}</Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fileId } = context.params;

  try {
    const file = (await axios.get(`/files/${fileId}`)).data;

    return {
      props: {
        file,
      },
    };
  } catch {
    context.res.writeHead(302, { Location: "/" });
    context.res.end();
    return {
      props: {},
    };
  }
};

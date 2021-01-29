import { GetServerSideProps } from "next";
import axios from "axios";

import { UploadedFile } from "../lib/interfaces";

export interface DownloadProps {
  file: UploadedFile;
}

export default function Download(props: DownloadProps) {
  return <p>{JSON.stringify(props.file)}</p>;
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
  } catch (e) {
    context.res.writeHead(302, { Location: "/" });
    context.res.end();
    return {
      props: {},
    };
  }
};

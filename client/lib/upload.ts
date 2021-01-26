import axios from "axios";

import { SignedPut, SelectedFile } from "./interfaces";

async function getSignedPut(): Promise<SignedPut> {
  const res = await axios.get("/uploads");
  return res.data;
}

export async function uploadFile(
  file: SelectedFile,
  setFile: (file: SelectedFile) => void
) {
  try {
    const signedPut = await getSignedPut();
    await axios.put(signedPut.url, file.file, {
      onUploadProgress: (progressEvent: ProgressEvent) => {
        const progress = (progressEvent.loaded * 100) / progressEvent.total;

        setFile({ ...file, progress, status: "uploading" });
      },
    });
  } catch {
    setFile({ ...file, status: "error" });
  }
}

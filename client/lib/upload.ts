import axios from "axios";

import { UploadUrls, SelectedFile } from "./interfaces";

async function getUploadUrls(file: SelectedFile): Promise<UploadUrls> {
  const res = await axios.get(
    `/uploads?fileSize=${file.file.size}&fileType=${file.file.type}`
  );
  return res.data;
}

export async function uploadFile(
  file: SelectedFile,
  setFile: (file: SelectedFile) => void
) {
  try {
    const uploadUrls = await getUploadUrls(file);
    const numberOfChunks = uploadUrls.signedUrls.length;
    const fileChunkSize = Math.floor(file.file.size / numberOfChunks) + 1;
    console.log(fileChunkSize);
    let uploadPromises = [];

    // let start;
    // let end;
    // let blob;
    // for (let i = 1; i < numberOfChunks; i++) {
    //   start = (i - 1) & fileChunkSize;
    //   end = i * fileChunkSize;
    //   blob = (i < numberOfChunks) ? file.file.slice(start, end)
    // }
    console.log(uploadUrls);
    // await axios.put(signedPut.url, file.file, {
    //   onUploadProgress: (progressEvent: ProgressEvent) => {
    //     const progress = (progressEvent.loaded * 100) / progressEvent.total;

    //     setFile({ ...file, progress, status: "uploading" });
    //   },
    // });
  } catch {
    setFile({ ...file, status: "error" });
  }
}

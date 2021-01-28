import axios from "axios";

import { UploadUrls, SelectedFile } from "./interfaces";
import { sum } from "./utils";

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
    let uploadPromises = [];

    let start: number = 0;
    let end: number = 0;
    let blob: Blob = null;
    let allProgress = Array.from({ length: numberOfChunks }, () => 0);
    for (let i = 1; i <= numberOfChunks; i++) {
      start = (i - 1) * fileChunkSize;
      end = i * fileChunkSize;
      blob =
        i < numberOfChunks
          ? file.file.slice(start, end)
          : file.file.slice(start);

      const uploadUrl = uploadUrls.signedUrls[i - 1];

      // Retry upload on error
      let axiosInstance = axios.create({});
      axiosInstance.interceptors.response.use(null, (error) => {
        if (error && error.config) {
          console.log(error.config);
          console.log("Error encountered when uploading. Retrying...");
          return (
            axios
              .get(
                `/uploads/single?key=${uploadUrls.key}&partNumber=${error.config.headers["Part-Number"]}&uploadId=${uploadUrls.uploadId}`
              )
              // Do not use axiosInstance for second try - just let second try fail
              .then((newUploadUrl) => {
                // uploadPromises.push(
                //   axios.request({ ...error.config, url: newUploadUrl.data })
                // );
              })
          );
        }
      });
      uploadPromises.push(
        axiosInstance.put(uploadUrl, blob, {
          headers: { "Content-Type": file.file.type, "Part-Number": i },
          onUploadProgress: (progressEvent: ProgressEvent) => {
            const percentCompleted =
              (progressEvent.loaded * 100) / progressEvent.total;
            const chunkFraction =
              i < numberOfChunks
                ? (end - start) / file.file.size
                : (file.file.size - start) / file.file.size;
            allProgress[i - 1] = percentCompleted * chunkFraction;
            setFile({
              ...file,
              progress: sum(allProgress),
              status: "uploading",
            });
          },
        })
      );
    }

    const allUploads = await Promise.allSettled(uploadPromises);
    console.log(allUploads);
    const uploads = allUploads.reduce(
      (acc, curr) => (curr.status === "fulfilled" ? [...acc, curr.value] : acc),
      []
    );
    console.log(uploads);
    await axios.post("/uploads/complete", {
      id: uploadUrls.key,
      uploadId: uploadUrls.uploadId,
      parts: uploads.map((response, i) => ({
        ETag: response.headers.etag,
        PartNumber: i + 1,
      })),
      name: file.file.name,
      size: "" + file.file.size,
      type: file.file.type,
    });
  } catch {
    setFile({ ...file, status: "error" });
  }
}

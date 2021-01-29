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

    const getPutConfig = (partNumber: number, chunkFraction: number) => ({
      headers: { "Content-Type": file.file.type, "Part-Number": partNumber },
      onUploadProgress: (progressEvent: ProgressEvent) => {
        const percentCompleted =
          (progressEvent.loaded * 100) / progressEvent.total;
        allProgress[partNumber - 1] = percentCompleted * chunkFraction;
        setFile({
          ...file,
          progress: sum(allProgress),
          status: "uploading",
        });
      },
    });

    for (let i = 1; i <= numberOfChunks; i++) {
      start = (i - 1) * fileChunkSize;
      end = i * fileChunkSize;
      blob =
        i < numberOfChunks
          ? file.file.slice(start, end)
          : file.file.slice(start);

      const uploadUrl = uploadUrls.signedUrls[i - 1];
      const chunkFraction =
        i < numberOfChunks
          ? (end - start) / file.file.size
          : (file.file.size - start) / file.file.size;
      uploadPromises.push(
        axios
          .put(uploadUrl, blob, getPutConfig(i, chunkFraction))
          .then((res) => ({ ETag: res.headers.etag, PartNumber: i }))
          .catch((err) => {
            return {
              rejected: true,
              partNumber: i,
              chunkFraction,
              blob: err.config.data,
            };
          })
      );
    }

    const firstBatch = await Promise.all(uploadPromises);
    const firstBatchSuccess = firstBatch.filter((res) => !res.rejected);
    const firstBatchFailure = firstBatch.filter((res) => res.rejected);

    const secondBatchPromises = firstBatchFailure.map(async (res) => {
      const newUploadUrl = (
        await axios.get(
          `/uploads/single?key=${uploadUrls.key}&partNumber=${res.partNumber}&uploadId=${uploadUrls.uploadId}`
        )
      ).data;
      return axios
        .put(
          newUploadUrl,
          blob,
          getPutConfig(res.partNumber, res.chunkFraction)
        )
        .then((response) => ({
          ETag: response.headers.etag,
          PartNumber: res.partNumber,
        }))
        .catch(() => null);
    });
    const secondBatch = await Promise.all(secondBatchPromises);
    const secondBatchSuccess = secondBatch.filter((res) => !!res);

    if (
      firstBatchSuccess.length + secondBatchSuccess.length !==
      numberOfChunks
    ) {
      throw new Error("Some chunks failed to upload");
    }

    await axios.post("/uploads/complete", {
      id: uploadUrls.key,
      uploadId: uploadUrls.uploadId,
      parts: [...firstBatchSuccess, ...secondBatchSuccess],
      name: file.file.name,
      size: "" + file.file.size,
      type: file.file.type,
    });

    if (typeof window !== "undefined") {
      setFile({
        ...file,
        status: "completed",
        downloadLink: `${window.location.protocol}//${window.location.host}/${uploadUrls.key}`,
      });
    }
  } catch {
    setFile({ ...file, status: "error" });
  }
}

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
    let uploadPromises = [];

    let start: number = 0;
    let end: number = 0;
    let blob: Blob = null;
    for (let i = 1; i <= numberOfChunks; i++) {
      start = (i - 1) * fileChunkSize;
      end = i * fileChunkSize;
      blob =
        i < numberOfChunks
          ? file.file.slice(start, end)
          : file.file.slice(start);

      const uploadUrl = uploadUrls.signedUrls[i - 1];

      uploadPromises.push(
        axios.put(uploadUrl, blob, {
          headers: { "Content-Type": file.file.type },
        })
      );
    }

    const uploads = await Promise.all(uploadPromises);
    await axios.post("/uploads/complete", {
      id: uploadUrls.key,
      uploadId: uploadUrls.uploadId,
      parts: uploads.map((response, i) => ({
        ETag: response.headers.etag,
        PartNumber: i + 1,
      })),
      name: file.file.name,
      size: file.file.size,
      type: file.file.type,
    });
  } catch {
    setFile({ ...file, status: "error" });
  }
}

import axios from "axios";

import { UploadData, SelectedFile } from "./interfaces";

async function getUploadData(): Promise<UploadData> {
  const res = await axios.get("/uploads");
  return res.data;
}

export async function uploadFile(
  file: SelectedFile,
  setFile: (file: SelectedFile) => void
) {
  const uploadData = await getUploadData();
  const fileName = encodeURIComponent(file.file.name);
  const contentType = file.file.type;
  const contentLength = file.file.size;

  for (let i = 0; i < 5; i++) {
    try {
      await axios.post(uploadData.uploadUrl, file.file, {
        headers: {
          Authorization: uploadData.authorizationToken,
          "X-Bz-File-Name": fileName,
          "Content-Type": contentType,
          "X-Bz-Content-Sha1": "do_not_verify",
        },
      });

      return;
    } catch {
      // Retry upload up to 5 times before giving up
    }
  }

  setFile({ ...file, status: "error" });
}

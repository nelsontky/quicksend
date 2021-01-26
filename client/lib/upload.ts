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
  const signedPut = await getSignedPut();
  try {
    axios.put(signedPut.url, file.file);
  } catch {
    setFile({ ...file, status: "error" });
  }
}

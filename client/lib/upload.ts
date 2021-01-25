import axios from "axios";

import { AuthorizeData, SelectedFile } from "./interfaces";

let authData: AuthorizeData = null;

async function getAuthData(): Promise<AuthorizeData> {
  const res = await axios.get("/api/v1/auth-token", {
    auth: {
      username: process.env.NEXT_PUBLIC_B2_APP_UPLOAD_ID,
      password: process.env.NEXT_PUBLIC_B2_APP_UPLOAD_KEY,
    },
  });

  return res.data;
}

export async function getUploadUrl() {
  authData = await getAuthData();
  const res = await axios.get(authData.apiUrl, {
    headers: { Authorization: authData.authorizationToken },
  });
  console.log(res.data);
}

// export async function uploadFile(
//   file: SelectedFile,
//   setFile: (file: SelectedFile) => void
// ) {
//   let succeeded = false;

//   for (let i = 0; i < 5 && !succeeded; i++) {

//   }
// }

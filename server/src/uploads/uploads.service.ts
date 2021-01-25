import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import axios from "axios";
import { AuthData } from "./interfaces/auth-data.interface";

@Injectable()
export class UploadsService {
  authData: AuthData;

  async getAuthData(): Promise<AuthData> {
    const res = await axios.get(
      "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
      {
        auth: {
          username: process.env.B2_APP_UPLOAD_ID,
          password: process.env.B2_APP_UPLOAD_KEY,
        },
      }
    );

    return res.data;
  }

  async getUploadUrl(): Promise<string> {
    for (let i = 0; i < 5; i++) {
      if (!this.authData) {
        this.authData = await this.getAuthData();
      }

      try {
        const res = await axios.post(
          this.authData.apiUrl + "/b2api/v2/b2_get_upload_url",
          { bucketId: this.authData.allowed.bucketId },
          {
            headers: {
              Authorization: this.authData.authorizationToken,
              "Content-Type": "application/json",
            },
          }
        );

        return res.data.uploadUrl;
      } catch (err) {
        this.authData = await this.getAuthData();
      }
    }

    throw new HttpException(
      "Internal Server Error",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

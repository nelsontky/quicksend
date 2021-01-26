import { Injectable } from "@nestjs/common";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class UploadsService {
  s3: AWS.S3;

  constructor() {
    // Create an S3 client for upload
    const credentials = new AWS.Credentials({
      accessKeyId: process.env.B2_APP_UPLOAD_ID,
      secretAccessKey: process.env.B2_APP_UPLOAD_KEY,
    });
    AWS.config.credentials = credentials;
    const endpoint = new AWS.Endpoint(process.env.B2_AWS_ENDPOINT);
    this.s3 = new AWS.S3({ endpoint, signatureVersion: "v4" });
  }

  async getSignedPut() {
    const params = { Bucket: "quicksend-1", Key: uuidv4(), Expires: 60 };
    const url = await this.s3.getSignedUrlPromise("putObject", params);
    return url;
  }
}

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import AWS from "aws-sdk";
import { resolve } from "path";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class UploadsService {
  private s3: AWS.S3;

  constructor() {
    // Create an S3 client for upload
    const credentials = new AWS.Credentials({
      accessKeyId: process.env.B2_APP_UPLOAD_ID,
      secretAccessKey: process.env.B2_APP_UPLOAD_KEY,
    });
    AWS.config.credentials = credentials;
    const endpoint = new AWS.Endpoint(process.env.B2_AWS_ENDPOINT);

    this.s3 = new AWS.S3({
      endpoint,
      signatureVersion: "v4",
      region: "us-west-000",
    });
  }

  private async createMultipartUpload(
    params: AWS.S3.CreateMultipartUploadRequest
  ): Promise<AWS.S3.CreateMultipartUploadOutput> {
    return new Promise((resolve, reject) => {
      this.s3.createMultipartUpload(params, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  async getUploadUrls(fileSize: number, fileType: string) {
    const params = {
      Bucket: process.env.B2_BUCKET_NAME,
      Key: uuidv4(),
      // Expires: 60,
      ContentType: fileType,
    };
    try {
      const uploadData = await this.createMultipartUpload(params);
      const numberOfChunks = Math.min(
        +process.env.MAX_UPLOAD_CHUNKS,
        Math.ceil(fileSize / +process.env.MIN_UPLOAD_CHUNK_SIZE)
      );

      let signedUrlPromises = [];

      for (let i = 1; i <= numberOfChunks; i++) {
        signedUrlPromises.push(
          this.s3.getSignedUrl("uploadPart", {
            Bucket: process.env.B2_BUCKET_NAME,
            Key: uploadData.Key,
            PartNumber: i,
            UploadId: uploadData.UploadId,
          })
        );
      }

      return await Promise.all(signedUrlPromises);
    } catch {
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    // const url = await this.s3.getSignedUrlPromise("putObject", params);
    // return { url, id: fileId };
  }
}

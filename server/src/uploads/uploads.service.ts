import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { CreateFileDto } from "./dto/create-file.dto";

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
        } else {
          resolve(data);
        }
      });
    });
  }

  async getUploadUrls(fileSize: number, fileType: string) {
    const params = {
      Bucket: process.env.B2_BUCKET_NAME,
      Key: uuidv4(),
      ContentType: fileType,
    };
    try {
      const uploadData = await this.createMultipartUpload(params);
      const numberOfChunks =
        Math.floor(fileSize / +process.env.UPLOAD_CHUNK_SIZE) + 1;
      let signedUrlPromises = [];

      for (let i = 1; i <= numberOfChunks; i++) {
        signedUrlPromises.push(
          this.s3.getSignedUrlPromise("uploadPart", {
            Bucket: process.env.B2_BUCKET_NAME,
            Key: uploadData.Key,
            PartNumber: i,
            UploadId: uploadData.UploadId,
          })
        );
      }

      const signedUrls = await Promise.all(signedUrlPromises);
      return { key: uploadData.Key, uploadId: uploadData.UploadId, signedUrls };
    } catch {
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUploadUrl(key: string, partNumber: number, uploadId: string) {
    return await this.s3.getSignedUrlPromise("uploadPart", {
      Bucket: process.env.B2_BUCKET_NAME,
      Key: key,
      PartNumber: partNumber,
      UploadId: uploadId,
      // Expires: 60,
    });
  }

  private async completeMultipartUpload(
    params: AWS.S3.CompleteMultipartUploadRequest
  ) {
    return new Promise((resolve, reject) => {
      this.s3.completeMultipartUpload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async completeUpload(body: CreateFileDto) {
    const params = {
      Bucket: process.env.B2_BUCKET_NAME,
      Key: body.id,
      MultipartUpload: {
        Parts: body.parts,
      },
      UploadId: body.uploadId,
    };

    try {
      await this.completeMultipartUpload(params);
    } catch {
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

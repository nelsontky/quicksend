import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import AWS from "aws-sdk";
import { resolve } from "path";
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
        }
        resolve(data);
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
      const numberOfChunks = Math.min(
        +process.env.MAX_UPLOAD_CHUNKS,
        Math.floor(fileSize / +process.env.MIN_UPLOAD_CHUNK_SIZE) + 1
      );
      let signedUrlPromises = [];

      for (let i = 1; i <= numberOfChunks; i++) {
        signedUrlPromises.push(
          this.s3.getSignedUrl("uploadPart", {
            Bucket: process.env.B2_BUCKET_NAME,
            Key: uploadData.Key,
            PartNumber: i,
            UploadId: uploadData.UploadId,
            Expires: 60,
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
    console.log(params);

    try {
      await this.completeMultipartUpload(params);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

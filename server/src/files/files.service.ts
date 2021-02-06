import {
  HttpStatus,
  Injectable,
  HttpException,
  Inject,
  CACHE_MANAGER,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IFile } from "./interfaces/file.interface";
import AWS from "aws-sdk";
import * as crypto from "crypto";

import { File } from "./entities/file.entity";

@Injectable()
export class FilesService {
  s3: AWS.S3;

  constructor(
    @InjectRepository(File) private filesRepository: Repository<File>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    // Create an S3 client for file reading
    const credentials = new AWS.Credentials({
      accessKeyId: process.env.B2_APP_READ_ID,
      secretAccessKey: process.env.B2_APP_READ_KEY,
    });
    AWS.config.credentials = credentials;
    const endpoint = new AWS.Endpoint(process.env.B2_AWS_ENDPOINT);

    this.s3 = new AWS.S3({
      endpoint,
      signatureVersion: "v4",
      region: "us-west-000",
    });
  }

  async isAuth(downloadKey: string) {
    console.log("Calling auth endpoint");
    const downloadCounts = await this.cacheManager.get(downloadKey);
    console.log(downloadCounts);
    console.log(typeof downloadCounts);
    if (typeof downloadCounts !== "number") {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    if (downloadCounts >= 2) {
      console.log("why so many ", downloadCounts);
      await this.cacheManager.del(downloadKey);
    } else {
      console.log("here is a normal increment ", downloadCounts);
      await this.cacheManager.set(downloadKey, downloadCounts + 1);
    }

    return true;
  }

  create(fileToCreate: IFile) {
    const file = new File();
    file.id = fileToCreate.id;
    file.name = fileToCreate.name;
    file.size = fileToCreate.size;
    file.type = fileToCreate.type;

    return this.filesRepository.save(file);
  }

  async findOne(id: string) {
    const file = await this.filesRepository.findOne(id);
    if (!file) {
      throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    } else {
      return file;
    }
  }

  private async setAuth() {
    const downloadKey = crypto.randomBytes(32).toString("hex");

    // New download key that hasn't been used before
    await this.cacheManager.set(downloadKey, 0, { ttl: 36000 });
    return downloadKey;
  }

  async download(id: string) {
    // const { name } = await this.filesRepository.findOne(id);
    // const params = {
    //   Bucket: process.env.B2_BUCKET_NAME,
    //   Key: id,
    //   Expires: 60,
    //   ResponseContentDisposition: `attachment; filename ="${name}"`,
    // };

    // return await this.s3.getSignedUrlPromise("getObject", params);
    const downloadKey = await this.setAuth();
    return `https://quicksend.global.ssl.fastly.net/${id}?downloadKey=${downloadKey}`;
  }
}

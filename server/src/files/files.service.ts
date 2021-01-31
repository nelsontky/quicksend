import { HttpStatus, Injectable, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IFile } from "./interfaces/file.interface";
import AWS from "aws-sdk";
// import { UpdateFileDto } from './dto/update-file.dto';

import { File } from "./entities/file.entity";

@Injectable()
export class FilesService {
  s3: AWS.S3;

  constructor(
    @InjectRepository(File) private filesRepository: Repository<File>
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

  async download(id: string) {
    const { name } = await this.filesRepository.findOne(id);
    const params = {
      Bucket: process.env.B2_BUCKET_NAME,
      Key: id,
      Expires: 60,
      ResponseContentDisposition: `attachment; filename ="${name}"`,
    };

    return await this.s3.getSignedUrlPromise("getObject", params);
  }
}

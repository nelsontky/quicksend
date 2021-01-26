import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateFileDto } from "./dto/create-file.dto";
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

  async checkFileExists(id: string) {
    return new Promise((resolve, _) => {
      const params = { Bucket: process.env.B2_BUCKET_NAME, Key: id };
      this.s3.headObject(params, (err, _) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  create(createFileDto: CreateFileDto) {
    const file = new File();
    file.id = createFileDto.id;
    file.name = createFileDto.name;
    file.size = createFileDto.size;
    file.type = createFileDto.type;
    file.createdBy = createFileDto.createdBy;

    return this.filesRepository.save(file);
  }

  // findAll() {
  //   return `This action returns all files`;
  // }

  findOne(id: string) {
    return this.filesRepository.findOne(id);
  }

  // update(id: number, updateFileDto: UpdateFileDto) {
  //   return `This action updates a #${id} file`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} file`;
  // }
}

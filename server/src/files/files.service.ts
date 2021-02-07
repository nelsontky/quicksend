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
  ) {}

  async isAuth(downloadKey: string) {
    const downloadCounts = await this.cacheManager.get(downloadKey);
    if (typeof downloadCounts !== "number") {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    if (downloadCounts >= 2) {
      await this.cacheManager.del(downloadKey);
    } else {
      await this.cacheManager.set(downloadKey, downloadCounts + 1, { ttl: 60 });
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
    await this.cacheManager.set(downloadKey, 0, { ttl: 60 });
    return downloadKey;
  }

  async download(id: string) {
    const downloadKey = await this.setAuth();
    const fileName = (await this.filesRepository.findOne(id)).name;

    // Development environment does not need key auth
    return process.env.NODE_ENV === "development"
      ? `https://quicksend-dev.global.ssl.fastly.net/${id}?fileName=${encodeURIComponent(
          fileName
        )}`
      : `https://quicksend.global.ssl.fastly.net/${id}?downloadKey=${downloadKey}&fileName=${encodeURIComponent(
          fileName
        )}`;
  }
}

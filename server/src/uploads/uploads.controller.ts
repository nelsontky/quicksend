import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { FilesService } from "src/files/files.service";
import { CreateFileDto } from "./dto/create-file.dto";
import { UploadsService } from "./uploads.service";

@Controller("uploads")
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly filesService: FilesService
  ) {}

  @Get()
  getUploadUrls(
    @Query("fileSize") fileSize: number,
    @Query("fileType") fileType: string
  ) {
    return this.uploadsService.getUploadUrls(fileSize, fileType);
  }

  @Get("single")
  getUploadUrl(
    @Query("key") key: string,
    @Query("partNumber") partNumber: number,
    @Query("uploadId") uploadId: string
  ) {
    return this.uploadsService.getUploadUrl(key, partNumber, uploadId);
  }

  @Post("complete")
  async completeUpload(@Body() body: CreateFileDto) {
    await this.uploadsService.completeUpload(body);
    const newFile = await this.filesService.create({
      id: body.id,
      name: body.name,
      size: body.size,
      type: body.type,
    });
    return newFile.id;
  }
}

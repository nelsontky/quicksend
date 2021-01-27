import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CreateFileDto } from "./dto/create-file.dto";
import { UploadsService } from "./uploads.service";

@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get()
  getUploadUrls(
    @Query("fileSize") fileSize: number,
    @Query("fileType") fileType: string
  ) {
    return this.uploadsService.getUploadUrls(fileSize, fileType);
  }

  @Post("/complete")
  completeUpload(@Body() body: CreateFileDto) {
    this.uploadsService.completeUpload(body);
  }
}

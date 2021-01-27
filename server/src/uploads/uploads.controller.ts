import { Controller, Get, Query } from "@nestjs/common";
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
}

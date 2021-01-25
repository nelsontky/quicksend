import { Controller, Get } from "@nestjs/common";
import { UploadsService } from "./uploads.service";

@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get()
  getUploadUrl() {
    return this.uploadsService.getUploadUrl();
  }
}

import { Controller, Get } from "@nestjs/common";
import { UploadsService } from "./uploads.service";

@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get()
  getUploadData() {
    return this.uploadsService.getUploadData();
  }
}

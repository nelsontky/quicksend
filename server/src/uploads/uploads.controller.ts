import { Controller, Get } from "@nestjs/common";
import { UploadsService } from "./uploads.service";

@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get()
  getSignedPut() {
    return this.uploadsService.getSignedPut();
  }
}

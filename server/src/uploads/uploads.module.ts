import { Module } from "@nestjs/common";
import { UploadsService } from "./uploads.service";
import { UploadsController } from "./uploads.controller";
import { FilesModule } from "src/files/files.module";

@Module({
  imports: [FilesModule],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from "@nestjs/common";
import { FilesService } from "./files.service";
import { CreateFileDto } from "./dto/create-file.dto";

import { CaptchaGuard } from "../common/guards/captcha.guard";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get("/auth")
  isAuth(@Query("downloadKey") downloadKey: string) {
    return this.filesService.isAuth(downloadKey);
  }

  @UseGuards(CaptchaGuard)
  @Post("/download/:id")
  download(@Param("id") id: string) {
    return this.filesService.download(id);
  }

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.create(createFileDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.filesService.findOne(id);
  }
}

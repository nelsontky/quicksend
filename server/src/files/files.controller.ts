import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { FilesService } from "./files.service";
import { CreateFileDto } from "./dto/create-file.dto";

import { CaptchaGuard } from "../common/guards/captcha.guard";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(CaptchaGuard)
  @Post("/download/:id")
  async download(@Param("id") id: string) {
    return this.filesService.download(id);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.filesService.findOne(id);
  }

  @Post()
  async create(@Body() createFileDto: CreateFileDto) {
    await this.filesService.create(createFileDto);
  }
}

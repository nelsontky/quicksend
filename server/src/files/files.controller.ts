import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { FilesService } from "./files.service";
import { CreateFileDto } from "./dto/create-file.dto";

import { CaptchaGuard } from "../common/guards/captcha.guard";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get("/test")
  testing() {
    console.log("This testing endpoint is being called");
    return "Test success";
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

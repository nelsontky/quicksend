import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from "@nestjs/common";
import { FilesService } from "./files.service";
import { CreateFileDto } from "./dto/create-file.dto";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.filesService.findOne(id);
  }

  @Post()
  async create(@Body() createFileDto: CreateFileDto) {
    await this.filesService.create(createFileDto);
  }
}

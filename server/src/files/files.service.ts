import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateFileDto } from "./dto/create-file.dto";
// import { UpdateFileDto } from './dto/update-file.dto';

import { File } from "./entities/file.entity";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private filesRepository: Repository<File>
  ) {}

  create(createFileDto: CreateFileDto) {
    const file = new File();
    file.versionId = createFileDto.versionId;
    file.name = createFileDto.name;
    file.size = createFileDto.size;
    file.type = createFileDto.type;
    file.createdBy = createFileDto.createdBy;

    return this.filesRepository.save(file);
  }

  // findAll() {
  //   return `This action returns all files`;
  // }

  findOne(id: string) {
    return this.filesRepository.findOne(id);
  }

  // update(id: number, updateFileDto: UpdateFileDto) {
  //   return `This action updates a #${id} file`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} file`;
  // }
}

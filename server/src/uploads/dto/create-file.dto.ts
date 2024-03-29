import {
  IsArray,
  IsNumber,
  IsString,
  Length,
} from "class-validator";

export class CreateFileDto {
  @IsString()
  @Length(1)
  readonly id: string;

  @IsString()
  @Length(1)
  readonly name: string;

  @IsString()
  @Length(1)
  readonly size: string;

  @IsString()
  readonly type: string;

  @IsString()
  @Length(1)
  readonly uploadId: string;

  @IsArray()
  readonly parts: { ETag: string; PartNumber: number }[];
}

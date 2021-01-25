import { IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateFileDto {
  @IsString()
  @Length(1)
  readonly versionId: string;

  @IsString()
  @Length(1)
  readonly name: string;

  @IsNumber()
  readonly size: number;

  @IsString()
  @Length(1)
  readonly type: string;

  @IsOptional()
  @IsString()
  readonly createdBy: string;
}

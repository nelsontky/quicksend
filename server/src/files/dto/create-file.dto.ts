import { IsNumber, IsOptional, IsString, Length } from "class-validator";

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

  @IsOptional()
  @IsString()
  readonly createdBy: string;
}

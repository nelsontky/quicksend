import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateFileDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly name: string;

  @IsNumber()
  readonly size: number;

  @IsString()
  readonly type: string;

  @IsOptional()
  @IsString()
  readonly createdBy: string;
}

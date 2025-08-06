import { PartialType } from '@nestjs/mapped-types';
import { CreateBlockDto } from './create-block.dto';
import { IsOptional, IsDate, Min } from 'class-validator';

export class UpdateBlockDto extends PartialType(CreateBlockDto) {
  @IsOptional()
  @IsDate()
  lastEdited?: Date;

  @IsOptional()
  @Min(50)
  width?: number;

  @IsOptional()
  @Min(50)
  height?: number;
}

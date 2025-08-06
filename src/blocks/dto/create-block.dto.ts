import { IsNotEmpty, IsString, IsObject, ValidateNested, IsOptional, IsIn, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class PositionDto {
  @IsNumber()
  @Min(0)
  x: number;

  @IsNumber()
  @Min(0)
  y: number;
}

export class CreateBlockDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['text', 'image', 'link'])
  type: 'text' | 'image' | 'link';

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  position: PositionDto;

  @IsNotEmpty()
  @IsString()
  boardId: string;

  @IsOptional()
  @IsNumber()
  @Min(50)
  width?: number;

  @IsOptional()
  @IsNumber()
  @Min(50)
  height?: number;
}

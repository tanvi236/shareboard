import { IsString, IsEnum, IsObject, ValidateNested, IsMongoId, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class PositionDto {
  @Min(0)
  x: number;

  @Min(0)
  y: number;
}

export class CreateBlockDto {
  @IsEnum(['text', 'image', 'link'])
  type: 'text' | 'image' | 'link';

  @IsString()
  content: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  position: PositionDto;

  @IsMongoId()
  boardId: string;
}

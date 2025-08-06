import { IsOptional, IsString, IsObject, ValidateNested, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { Type, Transform } from 'class-transformer';

class PositionDto {
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  x: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  y: number;

  @IsOptional()
  @IsString()
  dropEffect?: string;  // Allow dropEffect property
}

export class UpdateBlockDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PositionDto)
  position?: PositionDto;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Transform(({ value }) => parseFloat(value))
  width?: number;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Transform(({ value }) => parseFloat(value))
  height?: number;
}

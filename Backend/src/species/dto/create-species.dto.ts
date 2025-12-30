import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateSpeciesDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  zoneId: string; // รับเป็น ID ตัวเลข
}
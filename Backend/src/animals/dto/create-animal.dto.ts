import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAnimalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  characteristics: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  // 🔴 ของเดิม: @IsInt()  <-- ผิด! เพราะ ID เราเป็น UUID
  // 🟢 แก้เป็น:
  @IsString()
  @IsNotEmpty()
  speciesId: string; 
}
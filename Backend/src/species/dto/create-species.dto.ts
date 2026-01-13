import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSpeciesDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // 🔴 ของเดิม: @IsInt()
  // 🟢 แก้เป็น:
  @IsString() 
  @IsNotEmpty()
  zoneId: string;
}
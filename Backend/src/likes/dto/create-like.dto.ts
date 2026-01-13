import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLikeDto {
  // 🔴 ของเดิม: @IsInt()
  // 🟢 แก้เป็น:
  @IsString()
  @IsNotEmpty()
  animalId: string;
}
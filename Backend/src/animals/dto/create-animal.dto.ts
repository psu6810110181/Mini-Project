import { IsString, IsNotEmpty, IsInt, IsOptional, IsUrl } from 'class-validator';

export class CreateAnimalDto {
  @IsString()
  @IsNotEmpty()
  name: string; // ชื่อสัตว์

  @IsString()
  @IsNotEmpty()
  characteristics: string; // ลักษณะเด่น

  @IsString()
  @IsOptional() // รูปภาพไม่ใส่ก็ได้ (เผื่อยังไม่มีรูป)
  image_url?: string;

  @IsInt()
  @IsNotEmpty()
  speciesId: string; // ต้องส่ง ID สายพันธุ์มาเป็นตัวเลข
}
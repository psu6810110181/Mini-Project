// src/likes/likes.module.ts
import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Animal } from '../animals/entities/animal.entity'; // 👈 1. เพิ่มบรรทัดนี้

@Module({
  imports: [TypeOrmModule.forFeature([Like, Animal])], // 👈 2. เพิ่ม Animal เข้าไปในวงเล็บ
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
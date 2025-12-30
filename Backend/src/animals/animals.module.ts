import { Module } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { AnimalsController } from './animals.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. เพิ่ม
import { Animal } from './entities/animal.entity'; // 2. เพิ่ม

@Module({
  imports: [TypeOrmModule.forFeature([Animal])], // 👈 3. ต้องมีบรรทัดนี้!
  controllers: [AnimalsController],
  providers: [AnimalsService],
})
export class AnimalsModule {}
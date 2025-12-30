import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. เพิ่ม
import { Species } from './entities/species.entity'; // 2. เพิ่ม

@Module({
  imports: [TypeOrmModule.forFeature([Species])], // 👈 3. ใส่บรรทัดนี้
  controllers: [SpeciesController],
  providers: [SpeciesService],
})
export class SpeciesModule {}
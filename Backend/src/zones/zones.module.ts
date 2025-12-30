import { Module } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { ZonesController } from './zones.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. เพิ่ม
import { Zone } from './entities/zone.entity';   // 2. เพิ่ม

@Module({
  imports: [TypeOrmModule.forFeature([Zone])], // 👈 3. ใส่บรรทัดนี้
  controllers: [ZonesController],
  providers: [ZonesService],
})
export class ZonesModule {}
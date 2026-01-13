import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from './entities/zone.entity';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';

@Injectable()
export class ZonesService {
  constructor(@InjectRepository(Zone) private repo: Repository<Zone>) {}

  create(dto: CreateZoneDto) {
    return this.repo.save(dto);
  }

  findAll() { return this.repo.find({ relations: ['species'] }); }

// ไฟล์: src/zones/zones.service.ts

  async findOne(id: string) { // รับ id เป็น string (ตามที่คุณแก้ใน frontend)
    return this.repo.findOne({
      where: { id }, 
      // ⭐ บรรทัดนี้สำคัญที่สุด! ถ้าไม่มีบรรทัดนี้ สัตว์จะไม่โผล่
      relations: ['species', 'species.animals'], 
    });
  }

  async update(id:string , dto: UpdateZoneDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const zone = await this.findOne(id);
      
      // ✅ เพิ่มบล็อกนี้เข้าไป: ถ้าหาไม่เจอ ให้โยน Error ออกไปเลย
    if (!zone) {
      throw new NotFoundException(`ไม่พบโซนรหัส ${id}`);
    }

    return this.repo.remove(zone);
  }
}
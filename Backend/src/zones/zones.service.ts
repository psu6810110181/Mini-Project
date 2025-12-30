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

  async findOne(id: string) {
    const zone = await this.repo.findOne({ where: { id }, relations: ['species'] });
    if (!zone) throw new NotFoundException('ไม่เจอโซนนี้ครับ');
    return zone;
  }

  async update(id:string , dto: UpdateZoneDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const zone = await this.findOne(id);
    return this.repo.remove(zone);
  }
}
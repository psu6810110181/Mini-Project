import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Species } from './entities/species.entity';
import { Zone } from '../zones/entities/zone.entity';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';

@Injectable()
export class SpeciesService {
  constructor(@InjectRepository(Species) private repo: Repository<Species>) {}

  create(dto: CreateSpeciesDto) {
    // map zoneId -> zone object
    return this.repo.save({ 
        name: dto.name,
        zone: { id: dto.zoneId } as Zone 
    });
  }

  findAll() { return this.repo.find({ relations: ['zone', 'animals'] }); }

  async findOne(id: string) {
    const species = await this.repo.findOne({ where: { id }, relations: ['zone', 'animals'] });
    if (!species) throw new NotFoundException('ไม่เจอสายพันธุ์นี้ครับ');
    return species;
  }

  async update(id: string, dto: UpdateSpeciesDto) {
    const updateData: any = { ...dto };
    if (dto.zoneId) {
        updateData.zone = { id: dto.zoneId } as Zone;
        delete updateData.zoneId; // ลบ field เดิมออกกัน error
    }
    
    await this.repo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string) {
    const species = await this.findOne(id);
    return this.repo.remove(species);
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from './entities/animal.entity';
import { Species } from '../species/entities/species.entity'; // Import Species เพื่อใช้ Map Type
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animal)
    private animalsRepository: Repository<Animal>,
  ) {}

  // 🟢 Create
  async create(createAnimalDto: CreateAnimalDto) {
    // Map ข้อมูลจาก DTO -> Entity
    // แปลง speciesId ให้เป็น Object Relation ที่ TypeORM เข้าใจ
    const newAnimal = this.animalsRepository.create({
      ...createAnimalDto,
      species: { id: createAnimalDto.speciesId } as Species, 
    });
    
    return this.animalsRepository.save(newAnimal);
  }

  // 🔵 Find All
  findAll() {
    return this.animalsRepository.find({
      relations: ['species', 'species.zone'], // ดึงข้อมูลสายพันธุ์และโซนมาด้วย
    });
  }

  // 🔵 Find One
  async findOne(id: string) {
    const animal = await this.animalsRepository.findOne({
      where: { id },
      relations: ['species', 'species.zone'],
    });
    if (!animal) throw new NotFoundException(`ไม่เจอสัตว์หมายเลข #${id} ครับ`);
    return animal;
  }

  // 🟡 Update
  async update(id: string, updateAnimalDto: UpdateAnimalDto) {
    // ก๊อปปี้ข้อมูล DTO มาใส่ตัวแปรใหม่ (เพื่อจัดการ speciesId)
    const updateData: any = { ...updateAnimalDto };

    // ถ้ามีการส่ง speciesId มาใหม่ ให้แปลงเป็น Object Relation
    if (updateAnimalDto.speciesId) {
      updateData.species = { id: updateAnimalDto.speciesId } as Species;
      delete updateData.speciesId; // ลบ field เดิมทิ้งกัน Error
    }

    await this.animalsRepository.update(id, updateData);
    return this.findOne(id); // ส่งข้อมูลล่าสุดกลับไป
  }

  // 🔴 Remove
  async remove(id: string) {
    const animal = await this.findOne(id); // เช็คก่อนว่ามีไหม
    return this.animalsRepository.remove(animal);
  }
}
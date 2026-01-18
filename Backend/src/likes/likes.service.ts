import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository, Between } from 'typeorm';
import { CreateLikeDto } from './dto/create-like.dto';
import { User } from '../users/entities/user.entity';
import { Animal } from '../animals/entities/animal.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like) private likesRepository: Repository<Like>,
    @InjectRepository(Animal) private animalsRepository: Repository<Animal>,
  ) {}

  async toggleLike(userId: string, createLikeDto: CreateLikeDto) {
    const { animalId } = createLikeDto;

    // 🕒 1. กำหนดเวลาเริ่ม-จบวัน (00:00 - 23:59)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 🛠️ Debug: ดูค่าที่ส่งมา (ต้องเป็น String UUID ทั้งคู่)
    console.log(`Checking Vote -> User: ${userId} | Animal: ${animalId}`);

    // 🔍 2. เช็คว่าเคยกดหรือยัง (ใช้ String เพียวๆ ห้ามแปลงเป็น Number)
    const likeToday = await this.likesRepository.findOne({
      where: {
        user: { id: userId } as any,     // 👈 ส่ง String ไปตรงๆ
        animal: { id: animalId } as any, // 👈 ส่ง String ไปตรงๆ
        created_at: Between(startOfDay, endOfDay), // 👈 ชื่อตรงกับ Entity
      },
    });

    const animal = await this.animalsRepository.findOneBy({ id: animalId });
    if (!animal) throw new BadRequestException('ไม่พบข้อมูลสัตว์');

    let status = '';

    if (likeToday) {
      // 💔 CASE A: มีประวัติแล้ว -> ลบออก (Dislike)
      await this.likesRepository.remove(likeToday);
      animal.like_count = Math.max(0, animal.like_count - 1);
      status = 'unliked';
      console.log('Action: Unliked (Removed)');
    } else {
      // ❤️ CASE B: ยังไม่มี -> สร้างใหม่ (Like)
      
      // เช็คโควตา
      const usedQuota = await this.likesRepository.count({
        where: {
          user: { id: userId } as any, // 👈 String
          created_at: Between(startOfDay, endOfDay),
        },
      });

      console.log(`Used Quota: ${usedQuota}/3`);

      if (usedQuota >= 3) {
        throw new BadRequestException('โควตาโหวตวันนี้หมดแล้วครับ (3/3)');
      }

      // สร้าง record ใหม่
      const newLike = this.likesRepository.create({
        user: { id: userId } as any, // 👈 String
        animal: { id: animalId } as any, // 👈 String
      });
      await this.likesRepository.save(newLike);
      
      animal.like_count += 1;
      status = 'liked';
      console.log('Action: Liked (Created)');
    }

    // บันทึกยอดรวม
    await this.animalsRepository.save(animal);

    // 🔄 นับโควตาล่าสุดส่งกลับไป
    const currentUsed = await this.likesRepository.count({
      where: {
        user: { id: userId } as any, // 👈 String
        created_at: Between(startOfDay, endOfDay),
      },
    });

    return {
      message: status === 'liked' ? 'โหวตสำเร็จ! ❤️' : 'ยกเลิกโหวตแล้ว 💔',
      status,
      currentLikeCount: animal.like_count,
      remainingQuota: 3 - currentUsed
    };
  }

  // สำหรับตอนโหลดหน้าเว็บ
  async checkIsLiked(userId: string, animalId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const count = await this.likesRepository.count({
      where: {
        user: { id: userId } as any, // 👈 String
        animal: { id: animalId } as any, // 👈 String
        created_at: Between(startOfDay, endOfDay),
      },
    });

    return { isLiked: count > 0 };
  }
  
  findAll() { return this.likesRepository.find({ relations: ['user', 'animal'] }); }
}
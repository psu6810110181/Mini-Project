import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository, Between } from 'typeorm';
import { CreateLikeDto } from './dto/create-like.dto'; // 👈 Import DTO

// 👇 Import Entity อื่นๆ มาเพื่อแก้ตัวแดง (หรือจะใช้ as any ก็ได้ครับ แต่แบบนี้ชัวร์กว่า)
import { User } from '../users/entities/user.entity';
import { Animal } from '../animals/entities/animal.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  // 🟢 Toggle Like (สำหรับ User ทั่วไป)
  async toggleLike(userId: string, createLikeDto: CreateLikeDto) {
    const { animalId } = createLikeDto;

    // 1. เช็คว่าเคยไลค์หรือยัง?
    const existingLike = await this.likesRepository.findOne({
      where: {
        user: { id: userId } as User,
        animal: { id: animalId } as Animal,
      },
    });

    if (existingLike) {
      // 💔 ถ้ามีแล้ว -> Unlike (ลบออก)
      await this.likesRepository.remove(existingLike);
      return { message: 'Unlike เรียบร้อย (เอาใจออก)', status: 'unliked' };
    } else {
      // ❤️ ถ้ายังไม่มี -> Like (สร้างใหม่)
      
      // --- 🛡️ เริ่มโซนเช็คโควตา (3 ครั้ง/วัน) ---
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const countToday = await this.likesRepository.count({
        where: {
          user: { id: userId } as User,
          created_at: Between(today, tomorrow),
        },
      });

      if (countToday >= 3) {
        throw new BadRequestException('โควตาเต็มแล้ว! วันนี้กดไลค์ได้แค่ 3 ครั้งนะครับ');
      }
      // --- 🛡️ จบโซนเช็คโควตา ---

      // ✅ สร้างไลค์ใหม่
      const newLike = this.likesRepository.create({
        user: { id: userId } as User,
        animal: { id: animalId } as Animal,
      });
      await this.likesRepository.save(newLike);
      return { message: 'Like เรียบร้อย (ส่งใจไป)', status: 'liked' };
    }
  }

  // 🔵 ดูทั้งหมด (สำหรับ Admin)
  findAll() {
    return this.likesRepository.find({
      relations: ['user', 'animal'],
      order: { created_at: 'DESC' } // เรียงจากล่าสุดไปเก่าสุด
    });
  }

  // 🔴 ลบไลค์ตาม ID (เผื่อ Admin อยากลบ)
  async remove(id: string) {
    const like = await this.likesRepository.findOne({ where: { id } });
    if (!like) throw new NotFoundException('ไม่พบ Like นี้ครับ');
    return this.likesRepository.remove(like);
  }
}
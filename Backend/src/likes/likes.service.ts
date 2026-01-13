import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository, Between } from 'typeorm'; // 👈 สำคัญ: ต้องใช้ Between เพื่อเช็คเวลา
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

    // 🕒 1. กำหนดกรอบเวลา "วันนี้" (00:00 - 23:59)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 🔍 2. เช็คว่า "วันนี้" User คนนี้กดไลค์ตัวนี้ไปหรือยัง?
    const likeToday = await this.likesRepository.findOne({
      where: {
        user: { id: userId } as User,
        animal: { id: animalId } as Animal,
        created_at: Between(startOfDay, endOfDay), // 👈 เช็คแค่ช่วงเวลาวันนี้
      },
    });

    const animal = await this.animalsRepository.findOneBy({ id: animalId });
    if (!animal) throw new BadRequestException('ไม่พบข้อมูลสัตว์');

    let status = '';

    if (likeToday) {
      // 💔 CASE A: วันนี้กดไปแล้ว -> กดซ้ำคือ "เอาออก" (Dislike/Undo)
      // - ลบ Record ของวันนี้ทิ้ง
      // - ยอดไลค์สัตว์ลดลง 1
      await this.likesRepository.remove(likeToday);
      animal.like_count = Math.max(0, animal.like_count - 1);
      status = 'unliked';
    } else {
      // ❤️ CASE B: วันนี้ยังไม่กด -> ต้องเช็คโควตาก่อน
      
      // นับว่าวันนี้ใช้สิทธิ์ไปกี่ครั้งแล้ว (รวมทุกตัว)
      const usedQuota = await this.likesRepository.count({
        where: {
          user: { id: userId } as User,
          created_at: Between(startOfDay, endOfDay),
        },
      });

      // 🚫 ถ้าโควตาหมด (ครบ 3 แล้ว) ให้ Error กลับไป
      if (usedQuota >= 3) {
        throw new BadRequestException('โควตาโหวตวันนี้หมดแล้วครับ (3/3) พรุ่งนี้มาใหม่นะ!');
      }

      // ✅ ถ้าโควตาเหลือ -> สร้างไลค์ใหม่ (Vote)
      const newLike = this.likesRepository.create({
        user: { id: userId } as User,
        animal: { id: animalId } as Animal,
      });
      await this.likesRepository.save(newLike);
      
      animal.like_count += 1; // ยอดไลค์รวมเพิ่มขึ้น
      status = 'liked';
    }

    // บันทึกยอดรวมใหม่ลง Database
    await this.animalsRepository.save(animal);

    // 🔄 คำนวณโควตาคงเหลือล่าสุดส่งกลับไปให้ Frontend
    const currentUsed = await this.likesRepository.count({
      where: {
        user: { id: userId } as User,
        created_at: Between(startOfDay, endOfDay),
      },
    });

    return {
      message: status === 'liked' ? 'โหวตสำเร็จ! ❤️' : 'ยกเลิกโหวตแล้ว 💔',
      status, // 'liked' หรือ 'unliked'
      currentLikeCount: animal.like_count, // ยอดล่าสุด
      remainingQuota: 3 - currentUsed // เหลือโควตากี่ครั้ง
    };
  }
  
  // เพิ่มฟังก์ชันนี้ต่อท้ายฟังก์ชัน toggleLike
  async checkIsLiked(userId: string, animalId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // เช็คว่าวันนี้มี record การไลค์ไหม
    const count = await this.likesRepository.count({
      where: {
        user: { id: userId } as User,
        animal: { id: animalId } as any, // ใช้ as any หรือ Animal ถ้า import มาแล้ว
        created_at: Between(startOfDay, endOfDay),
      },
    });

    // ส่งกลับว่า true ถ้าเจอมากกว่า 0
    return { isLiked: count > 0 };
  }
  // ส่วนอื่นๆ คงเดิม
  findAll() { return this.likesRepository.find({ relations: ['user', 'animal'] }); }
}
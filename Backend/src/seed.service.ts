import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from './zones/entities/zone.entity';
import { Species } from './species/entities/species.entity';
import { Animal } from './animals/entities/animal.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Zone) private zoneRepo: Repository<Zone>,
    @InjectRepository(Species) private speciesRepo: Repository<Species>,
    @InjectRepository(Animal) private animalRepo: Repository<Animal>,
  ) {}

  async onModuleInit() {
    // 🛡️ 1. เช็คก่อนว่ามีข้อมูลโซนอยู่แล้วหรือยัง?
    const count = await this.zoneRepo.count();

    if (count > 0) {
      console.log('✅ พบข้อมูลเดิมในฐานข้อมูลแล้ว -> ข้ามการ Seed (เพื่อรักษาข้อมูล Likes)');
      return; // 🛑 จบการทำงานทันที ข้อมูลเก่าปลอดภัย
    }

    // ---------------------------------------------------------
    // ถ้าโค้ดมาถึงตรงนี้ แปลว่า Database ว่างเปล่า -> เริ่มสร้างใหม่
    // ---------------------------------------------------------
    console.log('🌱 ไม่พบข้อมูล... กำลังปลูกข้อมูลสัตว์โลกใหม่ (Seeding)...');

    // --- 1. สร้าง ZONES ---
    const savanna = await this.zoneRepo.save({ 
      name: 'โซนสะวันนา (Savanna)',
      description: 'ดินแดนแห่งทุ่งหญ้ากว้างใหญ่ พบกับสิงโตเจ้าป่าและยีราฟคอยาว',
      image_url: 'http://localhost:3000/images/zone/savanna.png' 
    });

    const polar = await this.zoneRepo.save({ 
      name: 'โซนขั้วโลก (Polar)',
      description: 'สัมผัสความหนาวเย็นและพบกับเพื่อนรักต่างสายพันธุ์ เพนกวินและหมีขาว',
      image_url: 'http://localhost:3000/images/zone/polarzone.png' 
    });

    const rainforest = await this.zoneRepo.save({ 
      name: 'โซนป่าดิบชื้น (Rainforest)',
      description: 'ผจญภัยในป่าทึบลึกลับ ที่อยู่อาศัยของเสือโคร่งและลิงกอริลลา',
      image_url: 'http://localhost:3000/images/zone/rainforest.png' 
    });

    const asia = await this.zoneRepo.save({ 
      name: 'โซนสัตว์เอเชีย (Asian)',
      description: 'ชื่นชมวิถีชีวิตสัตว์โซนเอเชีย ทั้งช้างไทยและแพนด้าแสนน่ารัก',
      image_url: 'http://localhost:3000/images/zone/asiazone.png' 
    });


    // --- 2. สร้าง SPECIES (พันธุ์สัตว์) ---
    // โซนสะวันนา
    const lion = await this.speciesRepo.save({ name: 'สิงโต (Lion)', image_url: 'https://placehold.co/600x400?text=Lion', zone: savanna });
    const zebra = await this.speciesRepo.save({ name: 'ม้าลาย (Zebra)', image_url: 'https://placehold.co/600x400?text=Zebra', zone: savanna });
    const giraffe = await this.speciesRepo.save({ name: 'ยีราฟ (Giraffe)', image_url: 'https://placehold.co/600x400?text=Giraffe', zone: savanna });

    // โซนขั้วโลก
    const penguin = await this.speciesRepo.save({ name: 'เพนกวิน (Penguin)', image_url: 'https://placehold.co/600x400?text=Penguin', zone: polar });
    const polarBear = await this.speciesRepo.save({ name: 'หมีขาว (Polar Bear)', image_url: 'https://placehold.co/600x400?text=Polar+Bear', zone: polar });

    // โซนป่าดิบชื้น
    const tiger = await this.speciesRepo.save({ name: 'เสือโคร่ง (Tiger)', image_url: 'https://placehold.co/600x400?text=Tiger', zone: rainforest });
    const gorilla = await this.speciesRepo.save({ name: 'กอริลลา (Gorilla)', image_url: 'https://placehold.co/600x400?text=Gorilla', zone: rainforest });

    // โซนสัตว์เอเชีย
    const elephant = await this.speciesRepo.save({ name: 'ช้างไทย (Thai Elephant)', image_url: 'https://placehold.co/600x400?text=Elephant', zone: asia });
    const panda = await this.speciesRepo.save({ name: 'แพนด้า (Panda)', image_url: 'https://placehold.co/600x400?text=Panda', zone: asia });

    // --- 3. สร้าง ANIMALS (ตัวสัตว์จริง) ---
    await this.animalRepo.save([
        // Savanna Animals
        { name: 'Simba', characteristics: 'กล้าหาญ เป็นจ่าฝูง', species: lion, image_url: 'https://placehold.co/400?text=Simba' },
        { name: 'Nala', characteristics: 'ฉลาด ว่องไว', species: lion, image_url: 'https://placehold.co/400?text=Nala' },
        { name: 'Marty', characteristics: 'ชอบวิ่ง รักอิสระ', species: zebra, image_url: 'https://placehold.co/400?text=Marty' },
        { name: 'Stripe', characteristics: 'ลายสวย กินเก่ง', species: zebra, image_url: 'https://placehold.co/400?text=Stripe' },
        { name: 'Melman', characteristics: 'คอยาว ขี้ระแวง', species: giraffe, image_url: 'https://placehold.co/400?text=Melman' },
        { name: 'Tall', characteristics: 'ใจดี ชอบกินใบไม้สูงๆ', species: giraffe, image_url: 'https://placehold.co/400?text=Tall' },

        // Polar Animals
        { name: 'Pingu', characteristics: 'ขี้เล่น ซุกซน', species: penguin, image_url: 'https://placehold.co/400?text=Pingu' },
        { name: 'Kowalski', characteristics: 'ฉลาด ชอบวางแผน', species: penguin, image_url: 'https://placehold.co/400?text=Kowalski' },
        { name: 'Skipper', characteristics: 'เป็นผู้นำ เข้มแข็ง', species: penguin, image_url: 'https://placehold.co/400?text=Skipper' },
        { name: 'Coca', characteristics: 'ตัวใหญ่ ขนฟู', species: polarBear, image_url: 'https://placehold.co/400?text=Coca' },
        { name: 'Snowy', characteristics: 'ชอบนอนบนน้ำแข็ง', species: polarBear, image_url: 'https://placehold.co/400?text=Snowy' },

        // Rainforest Animals
        { name: 'Shere Khan', characteristics: 'ดุร้าย น่าเกรงขาม', species: tiger, image_url: 'https://placehold.co/400?text=ShereKhan' },
        { name: 'Tigger', characteristics: 'ร่าเริง กระโดดเก่ง', species: tiger, image_url: 'https://placehold.co/400?text=Tigger' },
        { name: 'King Kong', characteristics: 'แข็งแรง ปกป้องเพื่อน', species: gorilla, image_url: 'https://placehold.co/400?text=Kong' },
        { name: 'George', characteristics: 'ตลก ขี้สงสัย', species: gorilla, image_url: 'https://placehold.co/400?text=George' },

        // Asian Animals
        { name: 'Kankluay', characteristics: 'กล้าหาญ รักชาติ', species: elephant, image_url: 'https://placehold.co/400?text=Kankluay' },
        { name: 'Chabakaew', characteristics: 'น่ารัก ใจดี', species: elephant, image_url: 'https://placehold.co/400?text=Chaba' },
        { name: 'Chuangchuang', characteristics: 'กินเก่ง นอนเก่ง', species: panda, image_url: 'https://placehold.co/400?text=Chuang' },
        { name: 'Linhui', characteristics: 'ขี้อ้อน รักสวยรักงาม', species: panda, image_url: 'https://placehold.co/400?text=LinHui' },
    ]);

    console.log('✅ เสกข้อมูล 4 โซน (Savanna, Polar, Rainforest, Asian) เรียบร้อยแล้ว!');
  }
}
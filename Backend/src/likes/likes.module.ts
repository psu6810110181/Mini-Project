import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. ต้องมี
import { Like } from './entities/like.entity';   // 2. ต้องมี

@Module({
  imports: [TypeOrmModule.forFeature([Like])], // 👈 3. สำคัญที่สุด! ถ้าไม่มีบรรทัดนี้ Error แน่นอน
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
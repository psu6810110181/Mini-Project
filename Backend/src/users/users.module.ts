import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. เพิ่มบรรทัดนี้
import { User } from './entities/user.entity';     // 2. เพิ่มบรรทัดนี้

@Module({
  // 3. ใส่บรรทัด imports นี้เข้าไปครับ 👇
  imports: [TypeOrmModule.forFeature([User])], 
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
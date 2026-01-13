import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // 🟢 กดไลค์/เลิกไลค์ (User ทั่วไปทำได้)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  toggleLike(@Request() req, @Body() createLikeDto: CreateLikeDto) {
    return this.likesService.toggleLike(req.user.userId, createLikeDto);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('status/:animalId')
  async checkStatus(@Request() req, @Param('animalId') animalId: string) {
    // ❌ ของเดิม: return this.likesService.checkIsLiked(req.user.id, animalId);
    
    // ✅ แก้เป็น: ใช้ req.user.userId (เหมือนตอน toggleLike)
    return this.likesService.checkIsLiked(req.user.userId, animalId);
  }


  // 🔵 ดูรายการไลค์ทั้งหมด (เฉพาะ Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.likesService.findAll();
  }
}
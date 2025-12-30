import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 1. ฟังก์ชันตรวจสอบ: เช็คว่าชื่อและรหัสผ่านถูกต้องไหม?
  async validateUser(username: string, pass: string): Promise<any> {
    // ค้นหา user จาก database
    const user = await this.usersService.findOneByUsername(username);

    // ถ้าเจอ user และ รหัสผ่านตรงกัน (ใช้ bcrypt เช็ค)
    if (user && (await bcrypt.compare(pass, user.password))) {
      // ตัดรหัสผ่านทิ้งก่อนส่งกลับไป (เพื่อความปลอดภัย)
      const { password, ...result } = user;
      return result;
    }
    
    return null; // ถ้าไม่ถูก ให้ส่ง null กลับไป
  }

  // 2. ฟังก์ชันล็อกอิน: ถ้าข้อมูลถูก จะออก Token ให้
  async login(user: any) {
    // ข้อมูลที่จะฝังไว้ใน Token (Payload)
    const payload = { 
      username: user.username, 
      sub: user.id, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload), // สร้าง Token ยาวๆ ส่งกลับไป
    };
  }
}
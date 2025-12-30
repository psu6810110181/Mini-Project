import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // รับคำสั่ง POST มาที่ http://localhost:3000/api/auth/login
  @Post('login')
  async login(@Body() body) {
    // 1. ส่งชื่อกับรหัสผ่านไปให้ Service ตรวจ
    const user = await this.authService.validateUser(body.username, body.password);

    // 2. ถ้าไม่เจอ หรือรหัสผิด ให้แจ้ง error กลับไป
    if (!user) {
      throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้องครับ');
    }

    // 3. ถ้าถูก ให้แจก Token
    return this.authService.login(user);
  }
}
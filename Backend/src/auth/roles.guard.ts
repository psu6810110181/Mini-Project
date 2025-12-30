import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../users/entities/user.entity';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. อ่านค่าจากป้าย @Roles ที่แปะอยู่ (ว่าต้องเป็น role อะไร)
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. ถ้าไม่ได้แปะป้าย @Roles ไว้ แปลว่าใครก็เข้าได้ (ให้ผ่าน)
    if (!requiredRoles) {
      return true;
    }

    // 3. ดึงข้อมูล User ออกมาจาก Request (ที่ผ่าน JWT Guard มาแล้ว)
    const { user } = context.switchToHttp().getRequest();

    // 4. เช็คว่า Role ของ User ตรงกับที่ป้ายต้องการไหม?
    return requiredRoles.some((role) => user.role === role);
  }
}
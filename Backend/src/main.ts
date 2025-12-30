import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config'; // 👈 1. Import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // เรียก ConfigService ออกมาใช้งาน
  const configService = app.get(ConfigService); // 👈 2. ดึง Service มา
  const port = configService.get<number>('APP_PORT') || 3000; // 👈 3. อ่านค่า Port (ถ้าไม่มีให้ใช้ 3000)

  app.enableCors();
  
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`); // (แถม) สั่งให้ Print บอกด้วย
}
bootstrap();
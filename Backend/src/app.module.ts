import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ZonesModule } from './zones/zones.module';
import { SpeciesModule } from './species/species.module';
import { AnimalsModule } from './animals/animals.module';
import { LikesModule } from './likes/likes.module';
import { AuthModule } from './auth/auth.module';
import { SeedService } from './seed.service';
import { Zone } from './zones/entities/zone.entity';
import { Species } from './species/entities/species.entity';
import { Animal } from './animals/entities/animal.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

// 👇 1. เพิ่ม 2 บรรทัดนี้ (สำคัญมาก!)
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // 👇 2. เพิ่มท่อนนี้เข้าไปใน imports เพื่อเปิดใช้ URL /images
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'), // ชี้ไปที่โฟลเดอร์ uploads หน้าบ้าน
      serveRoot: '/images', // ตั้งชื่อเล่น URL ว่า /images
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Zone, Species, Animal]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    ZonesModule,
    SpeciesModule,
    AnimalsModule,
    LikesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}

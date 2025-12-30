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
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

@Module({
imports: [
    TypeOrmModule.forRootAsync({ // 👈 เปลี่ยนเป็น forRootAsync
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // หรือ 'postgres', 'sqlite' ตามที่คุณใช้
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        
        // 2 บรรทัดล่างนี้เหมือนเดิม
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Zone, Species, Animal]),
    ConfigModule.forRoot({
      isGlobal: true, // ให้ทุก Module เรียกใช้ได้เลย ไม่ต้อง Import ซ้ำ
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

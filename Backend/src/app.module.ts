import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ZonesModule } from './zones/zones.module';
import { SpeciesModule } from './species/species.module';
import { AnimalsModule } from './animals/animals.module';
import { LikesModule } from './likes/likes.module';

@Module({
imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',      // ต้องตรงกับใน docker-compose
      password: 'password123', // ต้องตรงกับใน docker-compose
      database: 'zoo_db',     // ต้องตรงกับใน docker-compose
      autoLoadEntities: true, // โหลดไฟล์ Entity อัตโนมัติ
      synchronize: true,      // สร้างตารางใน DB ให้เอง (Dev Mode)
    }),
    UsersModule,
    ZonesModule,
    SpeciesModule,
    AnimalsModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

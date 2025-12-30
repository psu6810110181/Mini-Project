import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Like } from '../../likes/entities/like.entity';

// สร้าง Enum สำหรับ Role
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) // ชื่อซ้ำไม่ได้
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // ความสัมพันธ์: 1 User กด Like ได้หลายครั้ง
  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}
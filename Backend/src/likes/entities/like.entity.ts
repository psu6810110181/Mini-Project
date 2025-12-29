import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Animal } from '../../animals/entities/animal.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  // บันทึกเวลาที่กด (สำคัญมากสำหรับ Logic นับจำนวนต่อวัน)
  @CreateDateColumn()
  created_at: Date;

  // เชื่อมกับ User (ใครกด)
  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // เชื่อมกับ Animal (กดตัวไหน)
  @ManyToOne(() => Animal, (animal) => animal.likes)
  @JoinColumn({ name: 'animal_id' })
  animal: Animal;
}
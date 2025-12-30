import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Animal } from '../../animals/entities/animal.entity';

@Entity() // 👈 ต้องมี
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Animal, (animal) => animal.likes) // เพิ่มบรรทัดนี้ด้วยถ้ายังไม่มี
  @JoinColumn({ name: 'animal_id' })
  animal: Animal;
}
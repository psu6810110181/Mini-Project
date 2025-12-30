import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Species } from '../../species/entities/species.entity';
import { Like } from '../../likes/entities/like.entity';

@Entity()
export class Animal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // ชื่อสัตว์ (เช่น Simba)

  @Column({ nullable: true })
  characteristics: string; // ลักษณะนิสัย

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: 0 })
  like_count: number; // เก็บยอดไลค์รวม

  // เชื่อมกลับไปหา Species
  @ManyToOne(() => Species, (species) => species.animals)
  @JoinColumn({ name: 'species_id' })
  species: Species;

  // เชื่อมไปหา Likes (Many-to-Many ผ่านตาราง Likes)
  @OneToMany(() => Like, (like) => like.animal)
  likes: Like[];
}
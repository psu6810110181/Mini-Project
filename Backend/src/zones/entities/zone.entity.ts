import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Species } from '../../species/entities/species.entity';

@Entity()
export class Zone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // ชื่อโซน

  @Column({ nullable: true })
  description: string; // คำอธิบาย

  @Column({ nullable: true })
  image_url: string; // รูปภาพ

  // ความสัมพันธ์: 1 Zone มีได้หลาย Species
  @OneToMany(() => Species, (species) => species.zone)
  species: Species[];
}
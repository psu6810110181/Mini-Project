import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Zone } from '../../zones/entities/zone.entity';
import { Animal } from '../../animals/entities/animal.entity';

@Entity()
export class Species {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // ชื่อสายพันธุ์ (เช่น Lion)

  @Column({ nullable: true })
  description: string; // ข้อมูลสายพันธุ์

  @Column({ nullable: true })
  image_url: string; // รูปภาพ

  // เชื่อมกลับไปหา Zone (Many Species -> 1 Zone)
  @ManyToOne(() => Zone, (zone) => zone.species)
  @JoinColumn({ name: 'zone_id' }) // ชื่อ column ใน database จะเป็น zone_id
  zone: Zone;

  // เชื่อมไปหา Animal (1 Species -> Many Animals)
  // *ตรงนี้อาจจะมีขีดแดงชั่วคราว จนกว่าจะไปแก้ไฟล์ Animal ครับ*
  @OneToMany(() => Animal, (animal) => animal.species)
  animals: Animal[];
}
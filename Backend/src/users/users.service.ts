import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; // 👈 เพิ่ม Import
import { UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async onModuleInit() {
    const adminUsername = 'admin'; 
    const adminUser = await this.usersRepository.findOneBy({ username: adminUsername });
    if (!adminUser) {
      console.log('🚀 Creating Default Admin...');
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('admin1234', salt);
      const newAdmin = this.usersRepository.create({
        username: adminUsername,
        password: hashedPassword,
        role: UserRole.ADMIN,
      });
      await this.usersRepository.save(newAdmin);
      console.log('✅ Default Admin Created!');
    }
  }

  async create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const existingUser = await this.usersRepository.findOne({ where: { username } });
    if (existingUser) throw new ConflictException('Username นี้ถูกใช้ไปแล้วครับ');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      role: UserRole.USER, 
    });
    await this.usersRepository.save(user);
    return { message: 'สมัครสมาชิกสำเร็จ!', username: user.username };
  }

  findAll() { return this.usersRepository.find(); }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`ไม่พบ User ID: ${id}`);
    return user;
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  // 👇 ใช้ UpdateUserDto
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(updatedUser);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.usersRepository.remove(user);
  }
}
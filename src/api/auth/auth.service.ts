import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { UserDto } from './dto/user.dto';
import { UsersEntity } from '../../entities/users.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) { }

  async login(userDto: UserDto) {
    const { username, password, token } = userDto;

    const user = await this.usersRepository.findOne({
      where: { email: username },
      select: { id: true, password: true, email: true },
    });

    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new NotFoundException('User not found');

    delete user.password;

    await this.usersRepository.update(user.id, { token });

    return {
      status: HttpStatus.OK,
      message: user,
      error: 'Ok',
    };
  }
}

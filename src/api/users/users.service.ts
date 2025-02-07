import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PageOptionsDto } from 'src/dto/page-options.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageMetaDto } from 'src/dto/page-meta.dto';
import { PageDto } from 'src/dto/page.dto';

import { RolesEntity } from 'src/entities/roles.entity';
import { UsersEntity } from 'src/entities/users.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);

    await this.usersRepository.save(user);

    return user;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<UsersEntity>> {
    const [items, totalCount] = await this.usersRepository.findAndCount({
      order: { createdAt: pageOptionsDto.order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
      select: { id: true, name: true, email: true, phoneNumber: true, roleId: true, createdAt: true },
    });

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(items, pageMetaDto);
  }

  async findAllRoles() {
    const roles = await this.rolesRepository.find();
    return roles;
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      select: { id: true, name: true, email: true, phoneNumber: true, roleId: true, createdAt: true },
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.preload({
      id: +id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.usersRepository
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.usersRepository.remove(user);
  }
}

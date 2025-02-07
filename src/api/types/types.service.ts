import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PageOptionsDto } from 'src/dto/page-options.dto';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { PageMetaDto } from 'src/dto/page-meta.dto';
import { PageDto } from 'src/dto/page.dto';

import { TypesEntity } from 'src/entities/types.entity';

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(TypesEntity)
    private typesRepository: Repository<TypesEntity>,
  ) { }

  async create(createTypeDto: CreateTypeDto) {
    const type = this.typesRepository.create(createTypeDto);

    await this.typesRepository.save(type);

    return type;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<TypesEntity>> {
    const [items, totalCount] = await this.typesRepository.findAndCount({
      order: { createdAt: pageOptionsDto.order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(items, pageMetaDto);
  }

  async findOne(id: string) {
    const type = await this.typesRepository.findOne({
      where: { id },
    });

    if (!type) {
      throw new NotFoundException(`Type with ID ${id} not found`);
    }

    return type;
  }

  async update(id: string, updateTypeDto: UpdateTypeDto) {
    const type = await this.typesRepository.preload({
      id,
      ...updateTypeDto,
    });

    if (!type) {
      throw new NotFoundException(`Status with ID ${id} not found`);
    }

    await this.typesRepository.save(type);

    return type;
  }

  async remove(id: string) {
    const type = await this.typesRepository.findOne({
      where: { id },
    });

    if (!type) {
      throw new NotFoundException(`Status with ID ${id} not found`);
    }

    return this.typesRepository.remove(type);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { PageMetaDto } from 'src/dto/page-meta.dto';
import { PageDto } from 'src/dto/page.dto';

import { ExtrasEntity } from 'src/entities/extras.entity';

@Injectable()
export class ExtrasService {
  constructor(
    @InjectRepository(ExtrasEntity)
    private extrasRepository: Repository<ExtrasEntity>,
  ) { }

  async create(createExtraDto: CreateExtraDto) {
    const extra = this.extrasRepository.create(createExtraDto);

    await this.extrasRepository.save(extra);

    return extra;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<ExtrasEntity>> {
    const [items, totalCount] = await this.extrasRepository.findAndCount({
      order: { createdAt: pageOptionsDto.order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(items, pageMetaDto);
  }

  async findOne(id: string) {
    const extra = await this.extrasRepository.findOne({
      where: { id },
    });

    if (!extra) {
      throw new NotFoundException(`Extra with ID ${id} not found`);
    }

    return extra;
  }

  async update(id: string, updateExtraDto: UpdateExtraDto) {
    const extra = await this.extrasRepository.preload({
      id,
      ...updateExtraDto,
    });

    if (!extra) {
      throw new NotFoundException(`Extra with ID ${id} not found`);
    }

    await this.extrasRepository.save(extra);

    return extra;
  }

  async remove(id: string) {
    const extra = await this.extrasRepository.findOne({
      where: { id },
    });

    if (!extra) {
      throw new NotFoundException(`Extra with ID ${id} not found`);
    }

    return this.extrasRepository.remove(extra);
  }
}

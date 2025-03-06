import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { PageMetaDto } from 'src/dto/page-meta.dto';
import { PageDto } from 'src/dto/page.dto';

import { StatusesEntity } from 'src/entities/statuses.entity';
import { SearchDto } from 'src/dto/search.dto';

@Injectable()
export class StatusesService {
  constructor(
    @InjectRepository(StatusesEntity)
    private statusesRepository: Repository<StatusesEntity>,
  ) { }

  async create(createStatusDto: CreateStatusDto) {
    const statuses = this.statusesRepository.create(createStatusDto);

    await this.statusesRepository.save(statuses);

    return statuses;
  }

  async searchByWord(searchDto: SearchDto) {
    const searchedItemsByWord = this.statusesRepository.createQueryBuilder('statuses')
      .where('statuses.statusName LIKE :searchWord', {
        searchWord: `%${searchDto.searchWord}%`,
      })
      .getMany();

    if (!searchedItemsByWord) {
      throw new NotFoundException(`The search word ${searchDto.searchWord} was not found`);
    }

    return searchedItemsByWord;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<StatusesEntity>> {
    const [items, totalCount] = await this.statusesRepository.findAndCount({
      order: { createdAt: pageOptionsDto.order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(items, pageMetaDto);
  }

  async findOne(id: string) {
    const statuses = await this.statusesRepository.findOne({
      where: { id },
    });

    if (!statuses) {
      throw new NotFoundException(`Status with ID ${id} not found`);
    }

    return statuses;
  }

  async update(id: string, updateStatusDto: UpdateStatusDto) {
    const statuses = await this.statusesRepository.preload({
      id,
      ...updateStatusDto,
    });

    if (!statuses) {
      throw new NotFoundException(`Status with ID ${id} not found`);
    }

    await this.statusesRepository.save(statuses);

    return statuses;
  }

  async remove(id: string) {
    const statuses = await this.statusesRepository.findOne({
      where: { id },
    });

    if (!statuses) {
      throw new NotFoundException(`Status with ID ${id} not found`);
    }

    return this.statusesRepository.remove(statuses);
  }
}

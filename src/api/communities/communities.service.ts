import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Repository } from 'typeorm';

import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { PageMetaDto } from 'src/dto/page-meta.dto';
import { PageDto } from 'src/dto/page.dto';

import { CommunitiesEntity } from 'src/entities/communities.entity';

@Injectable()
export class CommunitiesService {

  constructor(
    @InjectRepository(CommunitiesEntity)
    private readonly communitiesRepository: Repository<CommunitiesEntity>,
  ) { }

  async create(createCommunityDto: CreateCommunityDto) {
    const community = this.communitiesRepository.create(createCommunityDto);

    await this.communitiesRepository.save(community);

    return community;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<CommunitiesEntity>> {
    const [items, totalCount] = await this.communitiesRepository.findAndCount({
      order: { createdAt: pageOptionsDto.order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(items, pageMetaDto);
  }

  async findAllByManager(id: string) {
    const communities = await this.communitiesRepository.find({
      where: { userId: id },
    });

    return communities;
  }

  async findOne(id: string) {
    const community = await this.communitiesRepository.findOne({
      where: { id },
    });

    if (!community) {
      throw new NotFoundException(`Community with ID ${id} not found`);
    }

    return community;
  }

  async update(id: string, updateCommunityDto: UpdateCommunityDto) {
    const community = await this.communitiesRepository.preload({
      id,
      ...updateCommunityDto,
    });

    if (!community) {
      throw new NotFoundException(`Community with ID ${id} not found`);
    }

    await this.communitiesRepository.save(updateCommunityDto);

    return community;
  }

  async remove(id: string) {
    const community = await this.communitiesRepository.findOne({
      where: { id },
    });

    if (!community) {
      throw new NotFoundException(`Community with ID ${id} not found`);
    }

    return this.communitiesRepository.remove(community);
  }
}

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
    const queryBuilder = this.communitiesRepository.createQueryBuilder('communities')
      .innerJoinAndSelect('communities.user', 'user')
      .innerJoinAndSelect('communities.company', 'company')
      .innerJoinAndSelect('user.role', 'role')
      .orderBy('communities.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .select([
        'communities.id',
        'communities.communityName',
        'communities.createdAt',
        'communities.updatedAt',
        'user.id',
        'user.name',
        'user.email',
        'user.phoneNumber',
        'company.id',
        'company.companyName',
        'role.id',
        'role.name',
      ])

    const [items, totalCount] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(items, pageMetaDto);
  }

  async findAllByManager(id: string) {
    const queryBuilder = this.communitiesRepository.createQueryBuilder('communities')
      .innerJoinAndSelect('communities.user', 'user')
      .innerJoinAndSelect('communities.company', 'company')
      .innerJoinAndSelect('user.role', 'role')
      .where('communities.userId = :id', { id })
      .select([
        'communities.id',
        'communities.communityName',
        'communities.createdAt',
        'communities.updatedAt',
        'user.id',
        'user.name',
        'user.email',
        'user.phoneNumber',
        'company.id',
        'company.companyName',
        'role.id',
        'role.name',
      ])

    const communities = await queryBuilder.getMany();

    if (!communities || communities.length === 0) {
      throw new NotFoundException(`Community with ID ${id} not found`);
    }

    return communities;
  }

  async findOne(id: string) {
    const community = await this.communitiesRepository.createQueryBuilder('communities')
      .innerJoinAndSelect('communities.user', 'user')
      .innerJoinAndSelect('communities.company', 'company')
      .innerJoinAndSelect('user.role', 'role')
      .where('communities.id = :id', { id })
      .select([
        'communities.id',
        'communities.communityName',
        'communities.createdAt',
        'communities.updatedAt',
        'user.id',
        'user.name',
        'user.email',
        'user.phoneNumber',
        'company.id',
        'company.companyName',
        'role.id',
        'role.name',
      ])
      .getOne();

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

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { PageMetaDto } from 'src/dto/page-meta.dto';
import { PageDto } from 'src/dto/page.dto';

import { ServicesEntity } from 'src/entities/services.entity';
import { ServicesByManagerDto } from './dto/services-by-manager.dto';

@Injectable()
export class ServicesService {

  constructor(
    @InjectRepository(ServicesEntity)
    private readonly servicesRepository: Repository<ServicesEntity>
  ) { }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<ServicesEntity>> {
    const queryBuilder = this.servicesRepository.createQueryBuilder('services')

    queryBuilder
      .leftJoinAndSelect('services.community', 'community')
      .leftJoinAndSelect('services.type', 'type')
      .leftJoinAndSelect('services.status', 'status')
      .orderBy('services.date', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)

    const [items, totalCount] = await queryBuilder.getManyAndCount()

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(items, pageMetaDto);
  }

  async findOne(id: string) {
    const queryBuilder = await this.servicesRepository.createQueryBuilder('services')
      .leftJoinAndSelect('services.community', 'community')
      .leftJoinAndSelect('services.type', 'type')
      .leftJoinAndSelect('services.status', 'status')
      .where('services.id = :id', { id })
      .getOne()

    if (!queryBuilder) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return queryBuilder;
  }

  async findByCleaner(userId: string, pageOptionsDto: PageOptionsDto): Promise<PageDto<ServicesEntity>> {
    const queryBuilder = this.servicesRepository.createQueryBuilder('services')
      .leftJoinAndSelect('services.community', 'community')
      .leftJoinAndSelect('services.type', 'type')
      .leftJoinAndSelect('services.status', 'status')
      .where('services.userId = :userId', { userId })
      .orderBy('services.date', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)

    const [items, totalCount] = await queryBuilder.getManyAndCount()

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(items, pageMetaDto);
  }

  async findByCommunities(servicesByManagerDto: ServicesByManagerDto, pageOptionsDto: PageOptionsDto): Promise<PageDto<ServicesEntity>> {
    const queryBuilder = this.servicesRepository.createQueryBuilder('services')
      .leftJoinAndSelect('services.community', 'community')
      .leftJoinAndSelect('services.type', 'type')
      .leftJoinAndSelect('services.status', 'status')
      .where('services.communityId IN (:...communities)', { communities: servicesByManagerDto.communities })
      .orderBy('services.date', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)

    const [items, totalCount] = await queryBuilder.getManyAndCount()

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(items, pageMetaDto);
  }

  async create(createServiceDto: CreateServiceDto) {
    const service = this.servicesRepository.create(createServiceDto);

    await this.servicesRepository.save(service);

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.servicesRepository.preload({
      id,
      ...updateServiceDto,
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    await this.servicesRepository.save(service);

    return service;
  }

  async remove(id: string) {
    const service = await this.servicesRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return this.servicesRepository.remove(service);
  }
}

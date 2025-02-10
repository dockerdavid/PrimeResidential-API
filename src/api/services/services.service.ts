import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ServicesByManagerDto } from './dto/services-by-manager.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { PageMetaDto } from 'src/dto/page-meta.dto';
import { PageDto } from 'src/dto/page.dto';

import { ExtrasByServiceEntity } from 'src/entities/extras_by_service.entity';
import { ServicesEntity } from 'src/entities/services.entity';

@Injectable()
export class ServicesService {

  constructor(
    @InjectRepository(ServicesEntity)
    private readonly servicesRepository: Repository<ServicesEntity>,
    @InjectRepository(ExtrasByServiceEntity)
    private readonly extrasByServiceRepository: Repository<ExtrasByServiceEntity>,
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
    const { extraId, ...createServiceDtoCopy } = createServiceDto

    const service = this.servicesRepository.create(createServiceDtoCopy);
    const extra = this.extrasByServiceRepository.create({ serviceId: service.id, extraId })

    await this.servicesRepository.save(service);
    await this.extrasByServiceRepository.save(extra);

    return {
      service,
      extra,
    }
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { PageMetaDto } from 'src/dto/page-meta.dto';
import { PageDto } from 'src/dto/page.dto';

import { ServicesEntity } from 'src/entities/services.entity';

@Injectable()
export class ServicesService {

  constructor(
    @InjectRepository(ServicesEntity)
    private readonly servicesRepository: Repository<ServicesEntity>
  ) { }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<ServicesEntity>> {
    const [items, totalCount] = await this.servicesRepository.findAndCount({
      order: { date: pageOptionsDto.order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(items, pageMetaDto);
  }

  async findOne(id: string) {
    const service = await this.servicesRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async findByUser(userId: string, pageOptionsDto: PageOptionsDto, createServiceDto: CreateServiceDto): Promise<PageDto<ServicesEntity>> {
    const [items, totalCount] = await this.servicesRepository.findAndCount({
      where: { userId },
      order: { date: pageOptionsDto.order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });

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

  remove(id: string) {
    return this.servicesRepository.delete(id);
  }
}

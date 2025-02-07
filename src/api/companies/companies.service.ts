import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { PageMetaDto } from 'src/dto/page-meta.dto';
import { PageDto } from 'src/dto/page.dto';

import { CompaniesEntity } from 'src/entities/companies.entity';

@Injectable()
export class CompaniesService {

  constructor(
    @InjectRepository(CompaniesEntity)
    private companiesRepository: Repository<CompaniesEntity>,
  ) { }

  async create(createCompanyDto: CreateCompanyDto) {
    const company = this.companiesRepository.create(createCompanyDto);

    await this.companiesRepository.save(company);

    return company;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<CompaniesEntity>> {
    const [items, totalCount] = await this.companiesRepository.findAndCount({
      order: { createdAt: pageOptionsDto.order },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(items, pageMetaDto);
  }

  async findOne(id: string) {
    const company = await this.companiesRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companiesRepository.preload({
      id,
      ...updateCompanyDto,
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    await this.companiesRepository.save(company);

    return company;
  }

  async remove(id: string) {
    const company = await this.companiesRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return this.companiesRepository.remove(company);
  }
}

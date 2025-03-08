import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import * as moment from 'moment';

import { ServicesEntity } from 'src/entities/services.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(ServicesEntity)
    private readonly servicesRepository: Repository<ServicesEntity>,
  ) { }

  async findOne(id: string) {
    const date = moment().format('YYYY-MM-DD');

    if (id === 'day') {
      return this.servicesRepository.find({ where: { date } });
    }

    if (id === 'week') {
      const startOfWeek = moment().startOf('isoWeek').format('YYYY-MM-DD');
      const endOfWeek = moment().endOf('isoWeek').format('YYYY-MM-DD');

      return this.servicesRepository.find({
        where: {
          date: Between(startOfWeek, endOfWeek),
        },
      });
    }

    if (id === 'month') {
      const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
      const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

      return this.servicesRepository.find({
        where: {
          date: Between(startOfMonth, endOfMonth),
        },
      });
    }

    if (id === 'year') {
      const startOfYear = moment().startOf('year').format('YYYY-MM-DD');
      const endOfYear = moment().endOf('year').format('YYYY-MM-DD');

      return this.servicesRepository.find({
        where: {
          date: Between(startOfYear, endOfYear),
        },
      });
    }

    return [];
  }
}

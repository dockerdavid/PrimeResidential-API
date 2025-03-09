import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import * as moment from 'moment';
import { ServicesEntity } from 'src/entities/services.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(ServicesEntity)
    private readonly servicesRepository: Repository<ServicesEntity>,
  ) {}

  async findOne(id: string) {
    const date = moment().format('YYYY-MM-DD');

    let whereCondition;

    if (id === 'day') {
      whereCondition = { date };
    } else if (id === 'week') {
      whereCondition = {
        date: Between(
          moment().startOf('isoWeek').format('YYYY-MM-DD'),
          moment().endOf('isoWeek').format('YYYY-MM-DD')
        ),
      };
    } else if (id === 'month') {
      whereCondition = {
        date: Between(
          moment().startOf('month').format('YYYY-MM-DD'),
          moment().endOf('month').format('YYYY-MM-DD')
        ),
      };
    } else if (id === 'year') {
      whereCondition = {
        date: Between(
          moment().startOf('year').format('YYYY-MM-DD'),
          moment().endOf('year').format('YYYY-MM-DD')
        ),
      };
    } else {
      return [];
    }

    const services = await this.servicesRepository.find({
      where: whereCondition,
      relations: ['community', 'type', 'status', 'user'],
    });

    return services.map(service => {
      if (service.user) {
        delete service.user.password;
      }
      return service;
    });
  }
}

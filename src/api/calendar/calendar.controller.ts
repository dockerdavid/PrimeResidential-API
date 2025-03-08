import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import { CalendarService } from './calendar.service';

import { CalendarEnum } from './dto/calendar.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) { }
  @ApiQuery({
    name: 'type',
    required: false,
    enum: CalendarEnum,
    description: 'Calendar type',
  })
  @Get()
  findOne(@Query('type') type: string) {
    return this.calendarService.findOne(type);
  }
}

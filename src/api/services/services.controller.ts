import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UpdateServiceDto } from './dto/update-service.dto';

import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { PageDto } from 'src/dto/page.dto';
import { ServicesEntity } from 'src/entities/services.entity';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { ServicesByManagerDto } from './dto/services-by-manager.dto';
import { SearchDto } from 'src/dto/search.dto';

@ApiBearerAuth()
@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

  @Post('/search')
  @UseGuards(AuthGuard('jwt'))
  searchByWord(@Query() pageOptionsDto: PageOptionsDto, @Body() searchDto: SearchDto): Promise<PageDto<ServicesEntity>> {
    return this.servicesService.searchByWord(searchDto, pageOptionsDto);
  }

  @Get('')
  @ApiPaginatedResponse(ServicesEntity)
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<ServicesEntity>> {
    return this.servicesService.findAll(pageOptionsDto);
  }

  @Get('/by-status/:statusID')
  @ApiPaginatedResponse(ServicesEntity)
  @UseGuards(AuthGuard('jwt'))
  findAllByStatusID(
    @Param('statusID') statusID: string,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<ServicesEntity>> {
    return this.servicesService.findAllByStatusID(statusID, pageOptionsDto);
  }

  @Get('/by-user/:userID/:statusID')
  @ApiPaginatedResponse(ServicesEntity)
  @UseGuards(AuthGuard('jwt'))
  findAllByUserIDStatusID(
    @Param('userID') userID: string,
    @Param('statusID') statusID: string,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<ServicesEntity>> {
    return this.servicesService.findAllByUserIDStatusID(userID, statusID, pageOptionsDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Post('/by-cleaner/:userId')
  @UseGuards(AuthGuard('jwt'))
  findByCleaner(
    @Param('userId') userId: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.servicesService.findByCleaner(userId, pageOptionsDto);
  }

  @Post('/by-communities')
  @UseGuards(AuthGuard('jwt'))
  findByCommunities(
    @Query() pageOptionsDto: PageOptionsDto,
    @Body() servicesByManagerDto: ServicesByManagerDto,
    @Query('statusID', new ParseIntPipe({ optional: true })) statusID?: number,
  ): Promise<PageDto<ServicesEntity>> {
    return this.servicesService.findByCommunities(servicesByManagerDto, pageOptionsDto, statusID);
  }

  @Post('/by-status/:statusID')
  @UseGuards(AuthGuard('jwt'))
  findByStatus(
    @Param('statusID') statusID: string,
    @Query() pageOptionsDto: PageOptionsDto,
    @Body() servicesByManagerDto: ServicesByManagerDto,
  ): Promise<PageDto<ServicesEntity>> {
    return this.servicesService.findByStatus(servicesByManagerDto, statusID, pageOptionsDto);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}

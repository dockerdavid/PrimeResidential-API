import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ServicesModule } from './api/services/services.module';
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './api/users/users.module';
import { CompaniesModule } from './api/companies/companies.module';
import { CommunitiesModule } from './api/communities/communities.module';
import { CostsModule } from './api/costs/costs.module';
import { ExtrasModule } from './api/extras/extras.module';
import { StatusesModule } from './api/statuses/statuses.module';
import { TypesModule } from './api/types/types.module';
import { DashboardModule } from './api/dashboard/dashboard.module';
import { CalendarModule } from './api/calendar/calendar.module';

import envVars from './config/env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: envVars.DB_HOST,
      port: envVars.DB_PORT,
      username: envVars.DB_USERNAME,
      password: envVars.DB_PASSWORD,
      database: envVars.DB_DATABASE,
      entities: [__dirname + '/entities/*.entity{.ts,.js}'],
    }),
    AuthModule,
    ServicesModule,
    UsersModule,
    CompaniesModule,
    CommunitiesModule,
    CostsModule,
    ExtrasModule,
    StatusesModule,
    TypesModule,
    DashboardModule,
    CalendarModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule { }

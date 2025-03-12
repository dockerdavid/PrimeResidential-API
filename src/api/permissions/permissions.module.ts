import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsByRoleEntity } from '../../entities/permissions_by_role';
import { PermissionsEntity } from '../../entities/permissions.entity';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService],
  imports: [TypeOrmModule.forFeature([PermissionsByRoleEntity, PermissionsEntity])]
})
export class PermissionsModule { }

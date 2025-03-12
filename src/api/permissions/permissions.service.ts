import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';

import { PermissionsByRoleEntity } from '../../entities/permissions_by_role';

@Injectable()
export class PermissionsService {

  constructor(
    @InjectRepository(PermissionsByRoleEntity)
    private permissionsRepository: Repository<PermissionsByRoleEntity>,
  ) { }

  async findAll() {
    return this.permissionsRepository.createQueryBuilder('permissions_by_role')
      .leftJoinAndSelect('permissions_by_role.permission', 'permission')
      .leftJoinAndSelect('permissions_by_role.role', 'role')
      .getMany();
  }

}

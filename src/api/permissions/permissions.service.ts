import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionsService {
  findAll() {
    return `This action returns all permissions`;
  }
}

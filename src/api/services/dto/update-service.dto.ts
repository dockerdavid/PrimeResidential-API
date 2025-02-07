import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsString } from 'class-validator';

import { CreateServiceDto } from './create-service.dto';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
    @ApiProperty({
        description: 'The id of the service',
        example: 1,
    })
    @IsString()
    id: string

}

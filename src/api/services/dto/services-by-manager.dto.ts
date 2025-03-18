import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsOptional, IsString } from 'class-validator';

export class ServicesByManagerDto {
    @ApiProperty({
        description: 'Array of community IDs',
        example: ['1', '2'],
    })
    @IsArray()
    @IsString({ each: true })
    communities: string[];

    @ApiProperty({
        description: 'Status ID',
        example: '1',
    })
    @IsString()
    @IsOptional()
    statusID?: string;
}

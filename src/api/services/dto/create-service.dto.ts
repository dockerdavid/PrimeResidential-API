import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
    @ApiProperty({
        description: 'The date of the service',
        example: '2025-12-31',
    })
    @IsDateString()
    date: string;

    @ApiProperty({
        description: 'The schedule of the service',
        example: '08:00:00',
    })
    @IsOptional()
    @IsString()
    schedule?: string | null;

    @ApiProperty({
        description: 'The comment of the service',
        example: 'This is a comment',
    })
    @IsOptional()
    @IsString()
    comment?: string | null;

    @ApiProperty({
        description: 'The cleaner comment of the service',
        example: 'This is a comment',
    })
    @IsOptional()
    @IsString()
    userComment?: string | null;

    @ApiProperty({
        description: 'The size of the unity',
        example: '1 Bedroom',
    })
    @IsString()
    unitySize: string;

    @ApiProperty({
        description: 'The number of the unity',
        example: '265',
    })
    @IsString()
    unitNumber: string;

    @ApiProperty({
        description: 'The id of the community',
        example: '5',
    })
    @IsString()
    communityId: string;

    @ApiProperty({
        description: 'The id of the type',
        example: '1',
    })
    @IsString()
    typeId: string;

    @ApiProperty({
        description: 'The id of the status',
        example: '1',
    })
    @IsString()
    statusId: string;

    @ApiProperty({
        description: 'The id of the user',
        example: '1',
    })
    @IsOptional()
    @IsString()
    userId?: string | null;
}

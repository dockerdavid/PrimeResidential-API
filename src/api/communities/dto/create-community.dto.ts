import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCommunityDto {
    @ApiProperty({ description: 'Nombre de la comunidad', maxLength: 80 })
    @IsNotEmpty()
    @IsString()
    communityName: string;

    @ApiProperty({ description: 'ID del supervisor de la comunidad', example: '1', required: false })
    @IsOptional()
    @IsString()
    supervisorUserId?: string;

    @ApiProperty({ description: 'ID del manager de la comunidad', example: '1', required: false })
    @IsOptional()
    @IsString()
    managerUserId?: string;

    @ApiProperty({ description: 'ID de la compañía asociada', example: '1' })
    @IsNotEmpty()
    @IsString()
    companyId: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCommunityDto {
    @ApiProperty({ description: 'Nombre de la comunidad', maxLength: 80 })
    @IsNotEmpty()
    @IsString()
    communityName: string;

    @ApiProperty({ description: 'ID del usuario asociado', example: '1' })
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiProperty({ description: 'ID de la compañía asociada', example: '1' })
    @IsNotEmpty()
    @IsString()
    companyId: string;
}

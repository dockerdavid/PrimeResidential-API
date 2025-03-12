import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'miContraseñaSegura123',
    })
    @IsString()
    @IsOptional()
    password: string;
}

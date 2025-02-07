import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Juan Pérez',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'juan.perez@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Número de teléfono del usuario (opcional)',
        example: '+1234567890',
        required: false,
    })
    @IsPhoneNumber()
    phoneNumber?: string;

    @ApiProperty({
        description: 'Identificador del rol del usuario',
        example: '1',
    })
    @IsString()
    roleId: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'miContraseñaSegura123',
    })
    @IsString()
    password: string;
}

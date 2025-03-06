import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateExtraDto {
    @ApiProperty({
        description: 'Nombre o descripción del extra',
        example: 'Servicio de instalación adicional',
    })
    @IsString()
    item: string;

    @ApiProperty({
        description: 'Precio del extra',
        example: 49.99,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    itemPrice: number;

    @ApiProperty({
        description: 'Comisión del extra (valor decimal). Si no se especifica, el valor por defecto es "0.00"',
        example: 0.00,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    commission: number;
}

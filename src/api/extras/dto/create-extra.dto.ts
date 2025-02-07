import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal } from "class-validator";

export class CreateExtraDto {
    @ApiProperty({
        description: 'Nombre o descripción del extra',
        example: 'Servicio de instalación adicional',
    })
    item: string;

    @ApiProperty({
        description: 'Precio del extra',
        example: 49.99,
    })
    @IsDecimal()
    itemPrice: number;

    @ApiProperty({
        description: 'Comisión del extra (valor decimal). Si no se especifica, el valor por defecto es "0.00"',
        example: '0.00',
    })
    commission: string;
}

import { ApiProperty } from "@nestjs/swagger";

export class CreateStatusDto {
    @ApiProperty({
        description: 'Nombre del status',
        example: 'Activo',
        maxLength: 15,
    })
    statusName: string;
}

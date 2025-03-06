import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateStatusDto {
    @ApiProperty({
        description: 'Nombre del status',
        example: 'Activo',
        maxLength: 15,
    })
    @IsString()
    statusName: string;
}

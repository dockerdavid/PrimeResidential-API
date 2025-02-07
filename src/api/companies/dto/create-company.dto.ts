import { ApiProperty } from "@nestjs/swagger";

import { IsString } from "class-validator";

export class CreateCompanyDto {
    @ApiProperty({
        description: 'Nombre de la compañía',
        example: 'Acme Corporation',
    })
    @IsString()
    companyName: string;
}

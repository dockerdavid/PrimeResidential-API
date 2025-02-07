import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';
import { IsString } from 'class-validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
    @ApiProperty({
        description: 'The id of the company',
        example: "1",
    })
    @IsString()
    id: string
}

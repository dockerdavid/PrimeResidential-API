import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { CreateStatusDto } from './create-status.dto';

export class UpdateStatusDto extends PartialType(CreateStatusDto) {
    @ApiProperty({
        description: 'The id of the status',
        example: "1",
    })
    @IsString()
    id: string
}

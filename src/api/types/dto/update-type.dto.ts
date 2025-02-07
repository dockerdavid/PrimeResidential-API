import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { CreateTypeDto } from './create-type.dto';

export class UpdateTypeDto extends PartialType(CreateTypeDto) {
    @ApiProperty({
        description: 'The id of the type',
        example: "1",
    })
    @IsString()
    id: string
}

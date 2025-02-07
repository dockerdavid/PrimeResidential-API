import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { CreateExtraDto } from './create-extra.dto';

export class UpdateExtraDto extends PartialType(CreateExtraDto) {
    @ApiProperty({
        description: 'The id of the extra',
        example: "1",
    })
    @IsString()
    id: string
}

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCommunityDto } from './create-community.dto';
import { IsString } from 'class-validator';

export class UpdateCommunityDto extends PartialType(CreateCommunityDto) {
    @ApiProperty({
        description: 'The id of the community',
        example: "1",
    })
    @IsString()
    id: string
}

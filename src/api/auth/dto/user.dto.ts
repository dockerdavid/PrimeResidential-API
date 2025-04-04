import { ApiProperty } from "@nestjs/swagger";

import { IsEmail, IsString, MinLength } from "class-validator";

export class UserDto {
    @ApiProperty({
        description: 'The username to use for login',
        example: 'user'
    })
    @IsEmail()
    @IsString()
    @MinLength(4)
    username: string;

    @ApiProperty({
        description: 'The password to use for login',
        example: 'password'
    })
    @IsString()
    @MinLength(4)
    password: string;

    @ApiProperty({
        description: 'The token to firebase',
        example: 'token'
    })
    @IsString()
    token: string;
}

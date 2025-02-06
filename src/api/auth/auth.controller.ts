import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) { }

  @Post()
  @HttpCode(200)
  @ApiOkResponse({ description: 'Auth success' })
  @ApiBadRequestResponse({ description: 'Bad request - Validation errors' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findAll(@Body() userDto: UserDto) {
    const user = await this.authService.login(userDto);

    const { message: { id, email, name } } = user

    return {
      token: this.generateToken({ id, email }),
      id,
      email,
      name,
    };

  }

  private generateToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}

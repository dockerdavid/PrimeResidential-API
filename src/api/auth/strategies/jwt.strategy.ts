import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Users } from '../entities/users.entity';

import envVars from 'src/config/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: envVars.JWT_SECRET,
        });
    }

    async validate(payload: JwtPayload): Promise<{ user: Users }> {
        const { id } = payload;

        const user = await this.usersRepository.findOne({
            where: {
                id,
            }
        })

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        delete user.password;

        return {
            user,
        };
    }
}

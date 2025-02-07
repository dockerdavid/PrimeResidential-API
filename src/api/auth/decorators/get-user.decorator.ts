import {
    ExecutionContext,
    InternalServerErrorException,
    createParamDecorator,
} from '@nestjs/common';

export const GetUser = createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user.user;

    if (!user) {
        throw new InternalServerErrorException('User not found');
    }

    return user;
});

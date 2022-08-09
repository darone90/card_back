import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { cryptoData } from 'cryptoConfig';
import { verify } from 'jsonwebtoken';
import { UserEntity } from 'src/user/user.entity';
import { DecodedToken } from 'src/types/user.type';
import { Reflector } from "@nestjs/core";


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private reflector: Reflector
    ) {
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<any> {

        const jwt = context.switchToHttp().getRequest().cookies.jwt;

        if (!jwt) {
            throw new UnauthorizedException()
        }

        const decoded = verify(jwt.accesToken, cryptoData.password) as DecodedToken

        const result = await UserEntity.findOne({
            where: {
                status: decoded.id
            }
        })

        if (!result) {
            throw new UnauthorizedException()
        }

        return true;
    }
}
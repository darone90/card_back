import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { cryptoData } from "cryptoConfig";
import { DecodedToken } from 'src/types/user.type';
import { verify } from 'jsonwebtoken';
import { UserEntity } from "src/user/user.entity";

export const UserObject = createParamDecorator((data, context: ExecutionContext) => {

    const jwt = context.switchToHttp().getRequest().cookies.jwt;

    if (jwt) {
        const decoded = verify(jwt.accesToken, cryptoData.password) as DecodedToken;
        const result = UserEntity.findOne({
            where: {
                status: decoded.id
            }
        })
        if (result) return result;

        return null
    }

    return null
});
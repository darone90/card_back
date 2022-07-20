import { Injectable } from '@nestjs/common';
import { authLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';
import { UserEntity } from 'src/user/user.entity';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from './jwt.strategy';
import { comparer } from 'src/utils/crypto';
import { cryptoData } from 'cryptoConfig';
import { UserObject } from 'src/decorators/userobj.decorator';


@Injectable()
export class AuthService {

    private createToken(currentTokneId: string): { accesToken: string, expiresIn: number } {
        const payload: JwtPayload = { id: currentTokneId };
        const expiresIn = 60 * 60 * 24;
        const accesToken = sign(payload, cryptoData.password, { expiresIn })
        return {
            accesToken,
            expiresIn
        }
    }

    private async generateToken(user: UserEntity): Promise<string> {
        let token: string;
        let userWithThisToken = null;
        do {
            token = uuid();
            userWithThisToken = await UserEntity.findOne({
                where: {
                    status: token
                }
            })
        } while (!!userWithThisToken);
        user.status = token;
        await user.save();

        return token;
    }



    async login(req: authLoginDto, res: Response): Promise<any> {
        try {
            const user = await UserEntity.findOne({
                where: {
                    login: req.login
                }
            })

            if (!user) {
                return res.json({
                    loggedIn: false,
                    message: 'user not exist'
                })
            }

            const isPasswordCorrect = comparer(req.password, user.hash, user.iv, user.salt);

            if (!isPasswordCorrect) {
                return res.json({
                    loggedIn: false,
                    message: 'uncorrect password'
                })
            }

            const token = this.createToken(await this.generateToken(user))

            return res.cookie('jwt', token, {
                secure: false,
                domain: 'localhost',
                httpOnly: true
            })
                .json({
                    loggedIn: true,
                    message: 'welcome'
                })
        } catch (err) {
            res
                .status(500)
                .json({
                    loggedIn: false,
                    message: 'server error'
                })
        }
    }

    async logout(user: UserEntity, res: Response): Promise<Response> {
        try {
            user.status = null;
            await user.save();

            return res
                .cookie('jwt', '')
                .json({
                    message: 'logout correct'
                })
        } catch (err) {
            res
                .status(500)
                .json({
                    message: 'server error'
                })
        }
    }
}

import { Injectable } from '@nestjs/common';
import { authLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';
import { UserEntity } from 'src/user/user.entity';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { comparer } from 'src/utils/crypto';
import { cryptoData } from 'cryptoConfig';

interface JwtPayload {
    id: string
}

@Injectable()
export class AuthService {

    private createToken(currentTokneId: string): { accesToken: string, expiresIn: number } {
        const payload: JwtPayload = { id: currentTokneId };
        const expiresIn = 1000 * 60 * 60 * 24; ///////////////////////do config przenieść
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



    async login(req: authLoginDto, res: Response): Promise<Response> {
        try {
            const user = await UserEntity.findOne({
                where: {
                    login: req.login
                }
            })

            if (!user) {
                return res.json({
                    actionStatus: false,
                    message: 'użytkownik o podanej nazwie nie istnieje'
                })
            }

            const isPasswordCorrect = await comparer(req.password, user.hash, user.iv, user.salt);

            if (!isPasswordCorrect) {
                return res.json({
                    actionStatus: false,
                    message: 'niepoprawne hasło'
                })
            }

            const token = this.createToken(await this.generateToken(user))

            return res.cookie('jwt', token, {
                secure: false,
                domain: 'localhost',
                httpOnly: true
            })
                .json({
                    actionStatus: true,
                    message: 'zalogowano'
                })
        } catch (err) {
            res
                .status(500)
                .json({
                    actionStatus: false,
                    message: 'błąd serwera'
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
                    actionStatus: true,
                    message: 'wylgowoano poprawnie'
                })
        } catch (err) {
            res
                .status(500)
                .json({
                    actionStatus: false,
                    message: 'błąd serwera'
                })
        }
    }
}

import { Injectable } from '@nestjs/common';
import { authLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';
import { UserEntity } from 'src/user/user.entity';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { comparer, hasher } from 'src/utils/crypto';
import { cryptoData } from 'cryptoConfig';
import { PasswordChange } from './dto/pass-change.dto';
import { StandardResponse } from 'src/types/user.type';
import { ErrorEntity } from 'src/error/error.entity';
import { addErrorToBase } from 'src/utils/error-handler';

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
            addErrorToBase(err as Error);
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
            addErrorToBase(err as Error);
            res
                .status(500)
                .json({
                    actionStatus: false,
                    message: 'błąd serwera'
                })
        };
    };

    async passwordChange(user: UserEntity, body: PasswordChange): Promise<StandardResponse> {

        try {
            const confirmation = await comparer(body.password, user.hash, user.iv, user.salt);

            if (!confirmation) {
                return {
                    actionStatus: false,
                    message: 'Podane hasło jest nieprawidłowe'
                };
            };

            if (body.newPassword !== body.confirm) {
                return {
                    actionStatus: false,
                    message: 'Potwierdzenie hasła jest inne niż hasło'
                };
            }

            const newData = await hasher(body.newPassword, user.salt);

            user.hash = newData.coded;
            user.iv = newData.iv;

            await user.save();
        } catch (err) {
            addErrorToBase(err as Error);
            return {
                actionStatus: false,
                message: 'Błąd serwera'
            };
        };
    };

    async getErrorLog(): Promise<StandardResponse> {

        try {
            const result = await ErrorEntity.find();

            if (result.length < 1) {
                return {
                    actionStatus: true,
                    message: []
                };
            };

            return {
                actionStatus: true,
                message: result
            };
        } catch (err) {
            addErrorToBase(err as Error);
            return {
                actionStatus: false,
                message: 'Błąd serwera'
            };
        };
    };

    async clearErrorLog(): Promise<StandardResponse> {
        try {
            const result = await ErrorEntity.find();

            if (result.length < 1) {
                return {
                    actionStatus: true,
                    message: 'Error log pusty'
                }
            };

            result.map(async (res) => {
                await res.remove()
            });

            return {
                actionStatus: true,
                message: 'Error log pusty'
            }
        } catch (err) {
            addErrorToBase(err as Error);
            console.log(err);
            return {
                actionStatus: false,
                message: 'Błąd serwera'
            }
        }
    }
}

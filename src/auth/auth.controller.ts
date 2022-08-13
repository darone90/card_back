import { Body, Controller, Get, Patch, Post, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserObject } from 'src/decorators/userobj.decorator';
import { UnauthorizedExceptionFilter } from 'src/filter/unauthorized.filter';
import { AuthGuard } from 'src/guard/Auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { authLoginDto } from './dto/auth-login.dto';
import { PasswordChange } from './dto/pass-change.dto';

@Controller('login')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('/')
    async userLogin(
        @Body() req: authLoginDto,
        @Res() res: Response
    ): Promise<any> {
        return this.authService.login(req, res)
    }

    @Patch('/')
    @UseGuards(AuthGuard)
    @UseFilters(new UnauthorizedExceptionFilter())
    async PasswordChange(
        @UserObject() user: UserEntity,
        @Body() body: PasswordChange,
    ) {
        return await this.authService.passwordChange(user, body);
    };

    @Get('/')
    async logout(
        @UserObject() user: UserEntity,
        @Res() res: Response
    ) {
        return await this.authService.logout(user, res);
    }

    @Get('/check')
    @UseGuards(AuthGuard)
    @UseFilters(new UnauthorizedExceptionFilter())
    checkIsLoggedIn() {
        return {
            actionStatus: true,
            message: 'ok'
        }
    };

    @Get('/error')
    @UseGuards(AuthGuard)
    @UseFilters(new UnauthorizedExceptionFilter())
    async getErrorLog() {
        return this.authService.getErrorLog();
    };

    @Get('/deleteerror')
    @UseGuards(AuthGuard)
    @UseFilters(new UnauthorizedExceptionFilter())
    async deleteErrorLog() {
        return await this.authService.clearErrorLog();
    };
};

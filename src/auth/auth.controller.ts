import { Body, Controller, Get, Post, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserObject } from 'src/decorators/userobj.decorator';
import { UserEntity } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { authLoginDto } from './dto/auth-login.dto';

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

    @Get('/out')
    async logout(
        @UserObject() user: UserEntity,
        @Res() res: Response
    ) {
        return await this.authService.logout(user, res);
    }

}

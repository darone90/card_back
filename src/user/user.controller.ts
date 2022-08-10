import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { UnauthorizedExceptionFilter } from 'src/filter/unauthorized.filter';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guard/Auth.guard';
import { destionation } from 'src/multer/multer.storage';
import { UserService } from './user.service';
import { UploadeArticleMulter, UploadeFileMulter } from 'src/types/multer.type';
import { SharpPipe } from 'src/pipes/image-resize.pipe';
import { FileValidationFilter } from 'src/filter/uncorrect-data.filter';
import { ArticleValidation } from 'src/pipes/article-validation.pipe';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { };

    @Post('/addarticle')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                {
                    name: 'file',
                    maxCount: 6,
                },
            ],
            {
                dest: destionation(),
            },
        ),
    )
    @UseFilters(new UnauthorizedExceptionFilter(), new FileValidationFilter())
    async addArticleToDataBase(
        @UploadedFiles(SharpPipe) incomeFiles: UploadeFileMulter,
        @Body(ArticleValidation) data: UploadeArticleMulter
    ) {
        return this.userService.addNewArticeToDataBase(data, incomeFiles);
    };

    @Get('/getone/:id')
    async getOneArtice(
        @Param() id: string
    ) {
        return await this.userService.getOneArticle(id);
    };

    @Get('/getfoto/:id')
    async sendBigFoto(
        @Param() id: string,
    ) {

    };

    @Delete('/delete/:id')
    @UseGuards(AuthGuard)
    @UseFilters(new UnauthorizedExceptionFilter())
    async deleteArticel(
        @Param() id: string,
    ) {
        return await this.userService.deleteArticle(id);
    };

    @Get('/list/:type')
    async getListOfArticles() {

    };

    @Get('/foto/remove/:id')
    @UseGuards(AuthGuard)
    @UseFilters(new UnauthorizedExceptionFilter())
    async removeFoto(
        @Param() id: string,
    ) {

    };

    @Post('/foto/add')
    @UseGuards(AuthGuard)
    @UseFilters(new UnauthorizedExceptionFilter())
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                {
                    name: 'file',
                    maxCount: 6,
                },
            ],
            {
                dest: destionation(),
            },
        ),
    )
    async addFotoToExistingArticle() {

    };

    @Patch('/article/patch/:id')
    @UseGuards(AuthGuard)
    @UseFilters(new UnauthorizedExceptionFilter())
    async patchExistingArticle() {

    };

}

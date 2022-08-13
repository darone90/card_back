import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFiles, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { UnauthorizedExceptionFilter } from 'src/filter/unauthorized.filter';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guard/Auth.guard';
import { destionation } from 'src/multer/multer.storage';
import { UserService } from './user.service';
import { UploadeFileMulter } from 'src/types/multer.type';
import { SharpPipe } from 'src/pipes/image-resize.pipe';
import { FileValidationFilter } from 'src/filter/uncorrect-data.filter';
import { ArticleValidation } from 'src/pipes/article-validation.pipe';
import { ArticleData } from './dto/article.dto';
import { ArticleValidationNoFile } from 'src/pipes/article-nofile.pipe';


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
        @UploadedFiles(SharpPipe) incomeFiles: UploadeFileMulter | null,
        @Body(ArticleValidation) data: ArticleData
    ) {
        return this.userService.addNewArticeToDataBase(data, incomeFiles);
    };

    @Get('/getone/:id')
    async getOneArtice(
        @Param('id') id: string
    ) {
        return await this.userService.getOneArticle(id);
    };

    @Get('/freespace')
    @UseGuards(AuthGuard)
    @UseFilters(new UnauthorizedExceptionFilter())
    async getFreeSace() {
        return await this.userService.getFreeSpace();
    }

    @Get('/delete/:id')
    @UseGuards(AuthGuard)
    @UseFilters(new UnauthorizedExceptionFilter())
    async deleteArticel(
        @Param('id') id: string,
    ) {
        return await this.userService.deleteArticle(id);
    };

    @Get('/list')
    async getListOfArticles() {
        return await this.userService.getArticleList();
    };

    @Get('/foto/remove/:id')
    @UseGuards(AuthGuard)
    @UseFilters(new UnauthorizedExceptionFilter())
    async removeFoto(
        @Param('id') id: string,
    ) {
        return await this.userService.fotoRemove(id);
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
    async addFotoToExistingArticle(
        @UploadedFiles(SharpPipe) incomeFiles: UploadeFileMulter | null,
        @Body() data: { id: string },
    ) {
        return await this.userService.addFotoToExistingArticle(data.id, incomeFiles);
    };

    @Patch('/article/patch')
    @UseGuards(AuthGuard)
    @UseFilters(new UnauthorizedExceptionFilter(), new FileValidationFilter())
    async patchExistingArticle(
        @Body(ArticleValidationNoFile) data: ArticleData,
    ) {
        return await this.userService.PatchExistingData(data);
    };

    @Get('/sendfoto/:id/:type')
    async sendFotoToClient(
        @Param('id') id: string,
        @Param('type') type: string,
        @Res() res: any
    ) {
        return await this.userService.sendFoto(res, id, type);
    }

}

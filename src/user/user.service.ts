import { Injectable } from '@nestjs/common';
import { unlink } from 'fs/promises';
import path from 'path';
import { destionation } from 'src/multer/multer.storage';
import { AfterParseData, UploadeArticleMulter, UploadeFileMulter } from 'src/types/multer.type';
import { StandardResponse } from 'src/types/user.type';
import { ArticleEntity } from './article.entity';
import { FotoEntity } from './foto.entity';

@Injectable()
export class UserService {

    async addNewArticeToDataBase(data: UploadeArticleMulter, file: UploadeFileMulter): Promise<StandardResponse> {

        try {
            const encoded = JSON.parse(data.data) as AfterParseData;

            const article = new ArticleEntity();
            article.title = encoded.title;
            article.text = encoded.text;
            article.date = encoded.date;
            article.section = encoded.section;

            await article.save();

            await Promise.all(file.file.map(async (foto) => {

                const fotoRec = new FotoEntity();
                fotoRec.name = foto.filename;
                fotoRec.orginalName = foto.originalname;
                fotoRec.size = foto.size;
                fotoRec.article = article;

                await fotoRec.save()
            }));

            return {
                actionStatus: true,
                message: 'Artykuł został dodany'
            }
        } catch (err) {
            console.log(err);
            await Promise.all(file.file.map(async (foto) => {
                await unlink(path.join(destionation(), foto.filename))
            }));

            return {
                actionStatus: false,
                message: 'Błąd dodawania'
            }
        }

    };

    async getOneArticle(id: string): Promise<StandardResponse> {

        try {
            const result = await ArticleEntity.findOne({
                where: {
                    id,
                }
            });

            if (!result) {
                return {
                    actionStatus: false,
                    message: "Artykuł nie istnieje w bazie"
                };
            };


            return {
                actionStatus: true,
                message: 'Tu zrobić jak trzeba'
            }
        } catch (err) {
            console.log(err)
            return {
                actionStatus: false,
                message: 'Błąd podczas pobierania artykułu'
            };
        };
    };

    async deleteArticle(id: string): Promise<StandardResponse> {

        try {
            const result = await ArticleEntity.findOne({
                where: {
                    id,
                }
            });

            if (!result) {
                return {
                    actionStatus: false,
                    message: 'Nie znaleziono wskazanego artykułu'
                };
            };

            await result.remove();

            return {
                actionStatus: true,
                message: 'Artykuł został usunięty'
            };
        } catch (err) {
            console.log(err)
            return {
                actionStatus: false,
                message: 'Błąd serwera'
            }
        }
    }
}

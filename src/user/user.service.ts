import { Injectable } from '@nestjs/common';
import { unlink } from 'fs/promises';
import * as path from 'path';
import { serverDataConf } from 'server.config';
import { destionation } from 'src/multer/multer.storage';
import { UploadeFileMulter } from 'src/types/multer.type';
import { Sections, StandardResponse } from 'src/types/user.type';
import { addErrorToBase } from 'src/utils/error-handler';
import { checkFreeSpace } from 'src/utils/free-space-counter';
import { ArticleEntity } from './article.entity';
import { ArticleData } from './dto/article.dto';
import { FotoEntity } from './foto.entity';

@Injectable()
export class UserService {

    async addNewArticeToDataBase(data: ArticleData, file: UploadeFileMulter | null): Promise<StandardResponse> {

        try {
            const article = new ArticleEntity();
            article.title = data.title;
            article.text = data.text;
            article.date = data.date;
            article.section = (data.section as unknown as Sections);

            await article.save();

            if (file) {
                await Promise.all(file.file.map(async (foto) => {

                    const fotoRec = new FotoEntity();
                    fotoRec.name = foto.filename;
                    fotoRec.orginalName = foto.originalname;
                    fotoRec.size = foto.size;
                    fotoRec.article = article;

                    await fotoRec.save()
                }));
            }

            return {
                actionStatus: true,
                message: 'Artykuł został dodany'
            }
        } catch (err) {
            addErrorToBase(err as Error);
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
                },
                relations: {
                    fotos: true,
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
                message: result
            }
        } catch (err) {
            addErrorToBase(err as Error);
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
                },
                relations: {
                    fotos: true
                }
            });

            if (!result) {
                return {
                    actionStatus: false,
                    message: 'Nie znaleziono wskazanego artykułu'
                };
            };

            result.fotos.forEach(async (foto) => {
                await unlink(path.join(destionation(), foto.name));
                await unlink(path.join(destionation(), foto.name + '.webp'));
            })

            await Promise.all(result.fotos.map(async (foto) => await foto.remove()))

            await result.remove();

            return {
                actionStatus: true,
                message: 'Artykuł został usunięty'
            };
        } catch (err) {
            addErrorToBase(err as Error);
            return {
                actionStatus: false,
                message: 'Błąd serwera'
            };
        };
    };

    async getArticleList(): Promise<StandardResponse> {
        try {
            const result = await ArticleEntity.find({
                select: ['title', 'date', 'id', 'section', 'text'],
                relations: {
                    fotos: true,
                }
            });

            if (!result) {
                return {
                    actionStatus: false,
                    message: 'Brak artykułów w bazie'
                }
            }

            return {
                actionStatus: true,
                message: result
            }

        } catch (err) {
            addErrorToBase(err as Error);
            return {
                actionStatus: false,
                message: 'Błąd serwera'
            };
        };
    };

    async getFreeSpace(): Promise<StandardResponse> {
        try {
            const takaneSpace = await checkFreeSpace();

            return {
                actionStatus: true,
                message: `${takaneSpace}/${serverDataConf.maxServerSpace}`
            }
        } catch (err) {
            console.log(err);
            return {
                actionStatus: false,
                message: `Błąd serwera`
            };
        };
    };

    async PatchExistingData(data: ArticleData): Promise<StandardResponse> {

        try {
            const result = await ArticleEntity.findOne({
                where: {
                    id: data.id
                }
            });

            if (!result) {
                return {
                    actionStatus: false,
                    message: 'Artykuł o podanym id nie istnieje'
                }
            };

            result.title = data.title;
            result.text = data.text;
            result.date = data.date;
            result.section = data.section;

            await result.save();

            return {
                actionStatus: true,
                message: 'Dane zostały wprowadzone'
            }
        } catch (err) {
            addErrorToBase(err as Error);
            return {
                actionStatus: false,
                message: 'Błąd serwera'
            };
        };
    };

    async sendFoto(res: any, id: string, type: string) {
        try {
            const result = await FotoEntity.findOne({
                where: {
                    id
                }
            });

            if (!result) {
                throw new Error('Nie znaleiono zdjęcia w bazie');
            };

            const name = type === 'mini' ? result.name + '.webp' : result.name;

            res.sendFile(
                name,
                {
                    root: destionation()
                }
            );
        } catch (err) {
            addErrorToBase(err as Error);
        };
    };

    async fotoRemove(id: string): Promise<StandardResponse> {

        try {
            const result = await FotoEntity.findOne({
                where: {
                    id,
                }
            });

            if (!result) {
                return {
                    actionStatus: false,
                    message: 'Nie znaleziono zdjęcia w bazie'
                };
            };

            await unlink(path.join(destionation(), result.name));
            await unlink(path.join(destionation(), result.name + '.webp'));

            await result.remove();

            return {
                actionStatus: true,
                message: 'Zdjęcie usunięte'
            };
        } catch (err) {
            addErrorToBase(err as Error);
            return {
                actionStatus: false,
                message: 'Błąd serwera'
            };
        };
    };

    async addFotoToExistingArticle(id: string, incomeFiles: UploadeFileMulter): Promise<StandardResponse> {

        try {
            const result = await ArticleEntity.findOne({
                where: {
                    id,
                },
                relations: {
                    fotos: true
                }
            });

            if (!result) {
                await unlink(path.join(destionation(), incomeFiles.file[0].filename));
                await unlink(path.join(destionation(), incomeFiles.file[0].filename + '.webp'))
                return {
                    actionStatus: false,
                    message: 'Artykuł nie istnieje w bazie'
                };
            }

            if (result.fotos.length >= 6) {
                await unlink(path.join(destionation(), incomeFiles.file[0].filename));
                await unlink(path.join(destionation(), incomeFiles.file[0].filename + '.webp'))
                return {
                    actionStatus: false,
                    message: 'Masz maksymalną ilośc zdjęć dla tego artykułu'
                };
            };

            const newFoto = new FotoEntity();

            newFoto.name = incomeFiles.file[0].filename;
            newFoto.orginalName = incomeFiles.file[0].originalname;
            newFoto.size = incomeFiles.file[0].size;
            newFoto.article = result;

            await newFoto.save();

            return {
                actionStatus: true,
                message: 'Zdjęcie zostało dodane'
            };
        } catch (err) {
            addErrorToBase(err as Error);
            return {
                actionStatus: false,
                message: 'Błąd serwera'
            };
        };
    };
};

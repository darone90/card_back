import { ArgumentMetadata, Injectable, PipeTransform, NotAcceptableException, SetMetadata } from "@nestjs/common";
import { UploadeArticleMulter } from "src/types/multer.type";
import { Sections } from "src/types/user.type";
import { ArticleData } from "src/user/dto/article.dto";


@Injectable()
export class ArticleValidation implements PipeTransform<UploadeArticleMulter, ArticleData> {


    transform(data: UploadeArticleMulter, metadata: ArgumentMetadata): ArticleData {

        const parsed = JSON.parse(data.data) as ArticleData;

        if (parsed.title.length < 2) {
            throw new NotAcceptableException(Error, 'Tytuł jest za krótki'); 
        };

        if (parsed.text.length < 10) {
            throw new NotAcceptableException(Error, 'Artykuł jest za krótki');
        };

        if (parsed.section !== Sections.glass && parsed.section !== Sections.welding && parsed.section !== Sections.automation && parsed.section !== Sections.programming) {
            throw new NotAcceptableException(Error, 'Niepoprawny typ artykułu');
        };

        if (parsed.date.length < 10) {
            throw new NotAcceptableException(Error, 'Niepoprawny format daty');
        };

        return parsed;
    }
}
import { ArgumentMetadata, Injectable, PipeTransform, NotAcceptableException } from "@nestjs/common";
import { Sections } from "src/types/user.type";
import { ArticleData } from "src/user/dto/article.dto";


@Injectable()
export class ArticleValidation implements PipeTransform<ArticleData, ArticleData> {

    transform(data: ArticleData, metadata: ArgumentMetadata): ArticleData {

        if (data.title.length < 2) {
            throw new NotAcceptableException(Error, 'Tytuł jest za krótki')
        };

        if (data.text.length < 10) {
            throw new NotAcceptableException(Error, 'Artykuł jest za krótki')
        };

        if (data.section !== Sections.glass && data.section !== Sections.welding && data.section !== Sections.automation && data.section !== Sections.programming) {
            throw new NotAcceptableException(Error, 'Niepoprawny typ artykułu')
        };

        if (data.date.length < 10) {
            throw new NotAcceptableException(Error, 'Niepoprawny format daty')
        };

        return data;
    }
}
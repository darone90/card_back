import { Sections } from "src/types/user.type";

export class ArticleData {
    id?: string;
    section: Sections;
    title: string;
    text: string;
    date: string;
}
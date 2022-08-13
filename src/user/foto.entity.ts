import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ArticleEntity } from "./article.entity";

@Entity()
export class FotoEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    orginalName: string;

    @Column()
    size: number;

    @ManyToOne(() => ArticleEntity, (article) => article.fotos)
    article: ArticleEntity;

}
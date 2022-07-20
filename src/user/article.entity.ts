import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Sections } from "src/types/user.type";

@Entity()
export class ArticleEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    section: Sections;

    @Column()
    title: string;

    @Column()
    text: string;

    @Column()
    fotos: string[];
}
import { BaseEntity, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class VisitationEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

}
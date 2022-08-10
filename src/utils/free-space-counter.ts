import { FotoEntity } from "src/user/foto.entity";

export const checkFreeSpace = async (): Promise<number> => {

    const data = await FotoEntity.find({
        select: ["size"]
    });

    const values = data.map(entity => entity.size);

    const allTakenSpace = values.reduce((prev, curr) => prev + curr);

    return allTakenSpace;
};
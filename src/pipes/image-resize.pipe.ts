import { Injectable, NotAcceptableException, PipeTransform } from '@nestjs/common';
import { readFile, unlink } from 'fs/promises';
import * as path from 'path';
import { serverDataConf } from 'server.config';
import * as sharp from 'sharp';
import { destionation } from 'src/multer/multer.storage';
import { UploadeFileMulter } from 'src/types/multer.type';
import { checkFreeSpace } from 'src/utils/free-space-counter';

@Injectable()
export class SharpPipe implements PipeTransform<UploadeFileMulter, Promise<UploadeFileMulter>> {

    async transform(files: UploadeFileMulter): Promise<UploadeFileMulter> {

        await Promise.all(
            files.file.map(async (file) => {

                if (file.size > serverDataConf.maxFotoSize) {
                    await unlink(path.join(destionation(), file.filename));
                    throw new NotAcceptableException(Error, 'Plik przekracza dozowolone 20 Mb');
                };

                if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
                    await unlink(path.join(destionation(), file.filename));
                    throw new NotAcceptableException(Error, 'Niedozwolony typ pliku');
                };

                const takenSpace = await checkFreeSpace();

                if (file.size + takenSpace > serverDataConf.maxServerSpace) {
                    await unlink(path.join(destionation(), file.filename));
                    throw new NotAcceptableException(Error, 'Przekroczono ilość dozwolonego miejsca');
                };

                const readed = await readFile(path.join(destionation(), file.filename));
                const filename = file.filename + '.webp';

                await sharp(readed)
                    .resize(800)
                    .webp({ effort: 3 })
                    .toFile(path.join(destionation(), filename));
            })
        );

        return files;
    };
}

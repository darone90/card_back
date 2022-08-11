import { ExceptionFilter, Catch, ArgumentsHost, NotAcceptableException } from "@nestjs/common";
import { Response } from 'express';
import { unlink } from "fs/promises";
import * as path from 'path';
import { destionation } from "src/multer/multer.storage";

@Catch()
export class FileValidationFilter implements ExceptionFilter {


    async catch(exception: NotAcceptableException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof NotAcceptableException) {

            const context = (host.switchToHttp().getRequest().files.file).map(obj => obj.filename);

            if (context) {
                if (context.length > 0) {
                    context.map(async (obj) => {
                        await unlink(path.join(destionation(), obj))
                    })
                }
            };

            const info = (exception.getResponse() as any).error;

            response
                .json({
                    actionStatus: false,
                    message: info
                })
        } else {
            response
                .json({
                    actionStatus: false,
                    message: 'nieznany błąd serwera'
                })
        }

    }
}
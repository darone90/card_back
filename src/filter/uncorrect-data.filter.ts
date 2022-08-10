import { ExceptionFilter, Catch, ArgumentsHost, NotAcceptableException } from "@nestjs/common";
import { Response } from 'express';

@Catch()
export class FileValidationFilter implements ExceptionFilter {
    catch(exception: NotAcceptableException, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const info = (exception as Error).message;

        response
            .json({
                actionStatus: false,
                message: info
            })
    }
}
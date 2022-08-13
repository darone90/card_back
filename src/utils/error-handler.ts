import { ErrorEntity } from "src/error/error.entity"

export const addErrorToBase = async (error: Error): Promise<void> => {

    const errorRecord = new ErrorEntity();

    errorRecord.date = (new Date(Date.now())).toDateString();
    errorRecord.message = error.message;
    errorRecord.stack = error.stack;
    errorRecord.name = error.name;

    await errorRecord.save();
}
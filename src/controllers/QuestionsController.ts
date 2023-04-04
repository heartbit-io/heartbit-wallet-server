import { Request, Response } from "express";
import { QuestionInstance } from "../models/QuestionModel";
import { HttpCodes } from "../util/HttpCodes";
class QuestionsController {
    async create(req: Request, res: Response) {
        try {
            const question = await QuestionInstance.create({
                ...req.body
            });

            return res.status(HttpCodes.CREATED).json({
                success: true,
                status_code: HttpCodes.CREATED,
                message: 'created question successfully',
                data: question
            });
        } catch (error) {
            return res.status(HttpCodes.UNPROCESSED_CONTENT).json({
                success: false,
                status_code: HttpCodes.UNPROCESSED_CONTENT,
                message: error
            });
        }
    }
}


export default new QuestionsController();

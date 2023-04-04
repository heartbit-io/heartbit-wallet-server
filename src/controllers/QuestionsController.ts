import { Request, Response } from 'express';
import { QuestionInstance } from '../models/QuestionModel';
import { HttpCodes } from '../util/HttpCodes';
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
      return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        status_code: HttpCodes.INTERNAL_SERVER_ERROR,
        message: error
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { questionId } = req.params;

      const question = await QuestionInstance.findOne({
        where: { id: questionId }
      });

      if (!question) {
        return res.status(HttpCodes.NOT_FOUND).json({
          success: false,
          status_code: HttpCodes.NOT_FOUND,
          message: 'Question was not found',
          data: null
        });
      }

        const delete_question = await question.destroy();

      return res.status(HttpCodes.OK).json({
        success: true,
        status_code: HttpCodes.OK,
        message: 'Question deleted successfully',
        data: delete_question
      });
    } catch (error) {
      return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        status_code: HttpCodes.INTERNAL_SERVER_ERROR,
        message: error
      });
    }
  }
}

export default new QuestionsController();

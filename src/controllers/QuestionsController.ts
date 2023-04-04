import { Request, Response } from 'express';
import { QuestionInstance } from '../models/QuestionModel';
import { HttpCodes } from '../util/HttpCodes';
import FormatResponse from '../lib/FormatResponse';
class QuestionsController {
  async create(req: Request, res: Response) {
    try {
      const question = await QuestionInstance.create({
        ...req.body
      });

      return res
        .status(HttpCodes.CREATED)
        .json(
          new FormatResponse(
            true,
            HttpCodes.CREATED,
            'Question posted successfully',
            question
          )
        );
    } catch (error) {
      return res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json(
          new FormatResponse(
            false,
            HttpCodes.INTERNAL_SERVER_ERROR,
            error,
            null
          )
        );
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { questionId } = req.params;

      const question = await QuestionInstance.findOne({
        where: { id: questionId }
      });

      if (!question) {
        return res
          .status(HttpCodes.NOT_FOUND)
          .json(
            new FormatResponse(
              false,
              HttpCodes.NOT_FOUND,
              'Question was not found',
              null
            )
          );
      }

      await question.destroy();

      return res
        .status(HttpCodes.OK)
        .json(
          new FormatResponse(
            true,
            HttpCodes.OK,
            'Question deleted successfully',
            null
          )
        );
    } catch (error) {
      return res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json(
          new FormatResponse(
            false,
            HttpCodes.INTERNAL_SERVER_ERROR,
            error,
            null
          )
        );
    }
  }
}

export default new QuestionsController();

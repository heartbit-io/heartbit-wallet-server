import { Router } from 'express';
import { QuestionInstance } from '../models/QuestionModel';
import { HttpCodes } from '../util/HttpCodes';

const router = Router();

router.post('/create', async (req, res) => {
  try {
    const question = await QuestionInstance.create({
      title: req.body.title,
      pubkey: req.body.pubkey,
      content: req.body.content,
      bounty_amount: req.body.bounty_amount,
      image: req.body.image
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
});

export { router as questionRoutes };

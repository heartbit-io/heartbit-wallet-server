import { body } from 'express-validator';

class QuestionsValidator {
  checkCreateQuestion() {
    return [
      body('title')
        .notEmpty()
        .isString()
        .trim()
        .escape()
        .withMessage('Title should not be empty'),
      body('pubkey')
        .notEmpty()
        .isAlphanumeric()
        .trim()
        .escape()
        .withMessage('User public key is required to post a question'),
      body('content')
        .isString()
        .notEmpty()
        .rtrim()
        .escape()
        .isLength({ min: 50 })
        .withMessage(
          'sufficient description of your health question is required'
        ),
      body('bounty_amount')
        .isNumeric()
        .notEmpty()
        .withMessage(
          'indicate the amount of bounty you want to place for this question'
        )
    ];
  }
}


export default new QuestionsValidator();

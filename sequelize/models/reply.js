/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const Question = require('./question');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reply.init({
    question_id: DataTypes.NUMBER,
    user_pubkey: DataTypes.STRING,
    content: DataTypes.STRING,
    best_reply: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'replies',
  });
  return Reply;
};

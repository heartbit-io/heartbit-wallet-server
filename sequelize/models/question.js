/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Question.init({
    id: DataTypes.NUMBER,
    content: DataTypes.TEXT,
    pubkey: DataTypes.STRING,
    bounty_amount: DataTypes.NUMBER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'questions',
    underscored: true,
  });
  return Question;
};

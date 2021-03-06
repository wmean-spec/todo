'use strict'
const { Model } = require('sequelize')

const passwords = require('../app/passwords')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      User.hasMany(models.Token, {
        foreignKey: 'userId'
      })
      User.hasMany(models.Task, {
        foreignKey: 'userId'
      })
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [3, 16] }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [8, 20] }
      }
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        afterValidate: async (user, options) => {
          if (user.password) {
            user.password = await passwords.hashPassword(user.password)
          }
        }
      }
    }
  )
  return User
}

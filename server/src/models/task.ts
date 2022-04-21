import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize, dt: typeof DataTypes) => {
  class task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static associate(models: { [key: string]: any }) {
      // define association here
    }
  }

  task.init(
    {
      title: dt.STRING,
      occurence: dt.INTEGER,
      lastDoneDateTime: dt.DATE
    },
    {
      sequelize,
      modelName: 'task',
    }
  );

  return task;
};

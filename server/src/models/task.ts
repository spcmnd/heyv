import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export default (sequelize: Sequelize, dt: typeof DataTypes) => {
  class Task extends Model<
    InferAttributes<Task>,
    InferCreationAttributes<Task>
  > {
    declare id: CreationOptional<number>;
    declare title: string;
    declare occurence: number;
    declare doneCount: number;
    declare dueDate: Date;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    /**
     * Helper method for defining associations.
     * This method is not >a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static associate(models: { [key: string]: Model }) {
      // define association here
    }
  }

  Task.init(
    {
      id: dt.INTEGER,
      title: dt.STRING,
      occurence: dt.INTEGER,
      doneCount: dt.INTEGER,
      dueDate: dt.DATE,
      createdAt: dt.DATE,
      updatedAt: dt.DATE,
    },
    {
      sequelize,
      modelName: 'task',
    }
  );

  return Task;
};

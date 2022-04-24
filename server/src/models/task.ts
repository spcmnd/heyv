import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  Sequelize,
} from 'sequelize';
import { Periodicity } from './periodicity';

export class Task extends Model<
  InferAttributes<Task>,
  InferCreationAttributes<Task>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare occurence: number;
  declare doneCount: number;
  declare dueDate: Date;
  declare periodicityId: ForeignKey<Periodicity['id']>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  /**
   * Helper method for defining associations.
   * This method is not >a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: { [key: string]: ModelStatic<any> }) {
    Task.hasOne(models.periodicity);
  }
}

export default (sequelize: Sequelize, dt: typeof DataTypes) => {
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

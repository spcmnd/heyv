import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  NonAttribute,
  Sequelize,
} from 'sequelize';
import { Task } from './task';

export class Periodicity extends Model<
  InferAttributes<Periodicity>,
  InferCreationAttributes<Periodicity>
> {
  declare id: CreationOptional<number>;
  declare name: string;

  declare tasks: NonAttribute<Task[]>;

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models: { [key: string]: ModelStatic<any> }) {
    Periodicity.hasMany(models.task, { foreignKey: 'periodicityId' });
  }
}

export default (sequelize: Sequelize, dt: typeof DataTypes) => {
  Periodicity.init(
    {
      id: dt.INTEGER,
      name: dt.STRING,
    },
    {
      sequelize,
      modelName: 'periodicity',
    }
  );

  return Periodicity;
};

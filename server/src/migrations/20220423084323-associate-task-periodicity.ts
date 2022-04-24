import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    return queryInterface.addColumn('tasks', 'periodicityId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'periodicities',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    return queryInterface.removeColumn('tasks', 'periodicityId');
  },
};

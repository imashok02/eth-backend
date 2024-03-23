module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'address', {
      type: Sequelize.DataTypes.STRING,
    });
    await queryInterface.sequelize.query(
      'ALTER TABLE users ALTER COLUMN name DROP NOT NULL;',
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE users ALTER COLUMN email DROP NOT NULL;',
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE users DROP COLUMN password;',
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE users ADD CONSTRAINT constraint_name UNIQUE (address);',
    );
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'address');
    await queryInterface.sequelize.query(
      'ALTER TABLE users ALTER COLUMN name SET NOT NULL;',
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE users ALTER COLUMN email SET NOT NULL;',
    );
    await queryInterface.addColumn('users', 'password', {
      type: Sequelize.DataTypes.STRING,
    });
  },
};

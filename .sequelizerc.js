require("dotenv").config();

const getBooleanConfig = input => {
  return input && input.trim() && input.trim().toLowerCase() === "true";
};

const databaseConfig = {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  dialect: "postgres",
  logging: getBooleanConfig(process.env.DB_LOGGING),
};

const sequelizeConfig = {
  [process.env.ENV]: databaseConfig,

  /**
   * when running sequelize-cli from command line without specifying NODE_ENV,
   * sequelize picks the "development" config, hence adding this here
   */
  development: databaseConfig,
};

module.exports = sequelizeConfig;

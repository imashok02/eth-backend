import 'dotenv/config';

import { getBooleanConfig, getNumberConfig } from './utils';

const EConfig = Object.freeze({
  env: process.env.NODE_ENV,
  serverPort: getNumberConfig(process.env.PORT),
  database: {
    host: process.env.DB_HOST,
    port: getNumberConfig(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: getBooleanConfig(process.env.DB_LOGGING),
  },
});

export { EConfig };

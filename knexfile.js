const { connection } = require('./.env');

module.exports = {
  client: 'mysql',
  connection,
  // connection: {
  //   database: 'backend-graphql-api',
  //   user: 'root',
  //   password: '456852',
  // },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};

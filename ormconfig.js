module.exports = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [`${process.env.TS_NODE_DEV === undefined ? 'dist/' : 'src/'}infraestructure/repositories/postgres/entities/index.{ts,js}`]
}

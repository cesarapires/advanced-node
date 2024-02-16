import { ConnectionOptions } from 'typeorm'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'kesavan.db.elephantsql.com',
  port: 5432,
  username: 'smahiplx',
  password: '9WdRD99QxXebRT8TIZ5um1F4rPncHRti',
  database: 'smahiplx',
  entities: ['dist/infraestructure/postgres/entities/index.js']
}

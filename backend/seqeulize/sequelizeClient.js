import {Sequelize} from "@sequelize/core";
import {MySqlDialect} from "@sequelize/mysql";

const sequelize = new Sequelize({
  dialect: MySqlDialect,
  database: 'maxlence',
  user: 'root',
  password: 'ujjwalbhai',
  host: 'localhost',
  port: 3306,
})

export default sequelize

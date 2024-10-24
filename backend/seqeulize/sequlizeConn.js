import sequelize from './sequelizeClient.js'
const sequelizeConn = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

export default sequelizeConn

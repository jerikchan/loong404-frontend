import mysql from 'mysql2/promise';

// 创建数据库连接池以提高性能
const config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT || '30303'),
};

const pool = mysql.createPool(config);

// const createTableQuery = `
// CREATE TABLE IF NOT EXISTS usages (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   address VARCHAR(50) NOT NULL,
//   month VARCHAR(50) NOT NULL,
//   count INT NOT NULL
// )`;

// pool.query(createTableQuery)

export default pool;

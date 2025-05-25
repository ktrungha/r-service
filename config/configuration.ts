export default () => {
  return {
    mysql: {
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      host: process.env.MYSQL_HOST,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      dbName: process.env.MYSQL_DB_NAME,
    },
    authen: {
      jwtKey: process.env.JWT_KEY,
      tokenNearExpirationWindow: 7 * 24 * 60 * 60 * 1000, // 7 days

      sessionDurationInMonths: 6,
    },
  };
};

module.exports = {
  port: 5000,
  mysql: {
    database: "fesp_backend",
    username: "dev",
    password: "dev"
  },
  mysqlCon: {
    host: "mysql",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  },
  SECRET: "testsecret",
  SALT_ROUNDS: 8,
  login: {
    fb: {
      FB_CLIENT_ID: "501726963963124",
      FB_CLIENT_SECRET: "50ae79e17e7c781f3d8abfd5d91f7c37",
      FB_CALLBACK_URL: "http://3.219.220.166:5000/auth/facebook/callback"
    },
    google: {
      GOOGLE_CLIENT_ID:
        "255901266837-gg8jodm0dfptjjb7hk3h4buio59ma1kt.apps.googleusercontent.com",
      GOOGLE_CLIENT_SECRET: "Wp1XLwrD38D9bIhIZ6r5idQd",
      GOOGLE_CALLBACK_URL: "http://3.219.220.166:5000/auth/google/callback"
    }
  }
};

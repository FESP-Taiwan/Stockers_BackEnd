module.exports = {
    port: 5000,
    mysql: {
        "database": "fesp_backend",
        "username": "dev",
        "password": "dev"
    },
    mysqlCon: {
        "host": "mysql",
        "dialect": "mysql",
        "pool": {
            "max": 5,
            "min": 0,
            "idle": 10000
        }
    },
    SECRET: "testsecret",
    SALT_ROUNDS: 8,
    login: {
        fb: {
            FB_CLIENT_ID: "683948768767075",
            FB_CLIENT_SECRET: "b1eb1c91231d2341503b5d40d77fd53f",
            FB_CALLBACK_URL: "https://stockers.ml/auth/facebook/callback",
        },
        google: {
            GOOGLE_CLIENT_ID: "255901266837-gg8jodm0dfptjjb7hk3h4buio59ma1kt.apps.googleusercontent.com",
            GOOGLE_CLIENT_SECRET: "Wp1XLwrD38D9bIhIZ6r5idQd",
            GOOGLE_CALLBACK_URL: "http://127.0.0.1:5000/auth/google/callback",
        }
    }
}
module.exports={
    port:5000,
    mysql: {
        "database": "rds",//asw
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
    SECRET:"testsecret",
    SALT_ROUNDS:8,
    login:{
        fb:{
            FB_CLIENT_ID:"501726963963124",
            FB_CLIENT_SECRET:"50ae79e17e7c781f3d8abfd5d91f7c37",
            FB_CALLBACK_URL:"https://631669ea.ngrok.io/auth/facebook/callback",
        },
        google:{
            GOOGLE_CLIENT_ID:"40821020840-v7oqeitiu2n1ed2iibpqfp18oshrv6lp.apps.googleusercontent.com",
            GOOGLE_CLIENT_SECRET:"KLz4PtwVuibWcVdcf2U44BV7",
            GOOGLE_CALLBACK_URL:"http://127.0.0.1:5000/auth/google/callback",
        }
    }
}
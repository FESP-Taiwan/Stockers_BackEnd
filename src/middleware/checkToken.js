let jwt = require("jsonwebtoken");
const config = require("config");
const SECRET = config.get("SECRET");

let checkToken = (req, res, next) => {
  let token = req.headers.authorization; // Express headers are auto converted to lowercase

  if (token) {
    next();
  } else {
    return res.json({
      success: false,
      message: "Auth token is not supplied"
    });
  }
};

module.exports = {
  checkToken
};

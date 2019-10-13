var express = require("express");
var router = express.Router();
var passport = require("../middleware/passport");

router.use(passport.initialize());

router.get(
  "/by_fb",
  passport.authenticate("facebook", { authType: "reauthenticate" })
);
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/test" }),
  async (req, res) => {
    const userid = req.user[0].dataValues.id;
    const username = req.user[0].dataValues.name;
    const token = req.user[1];
    res.json({ userid, username, token });
  }
);

router.get(
  "/by_google",
  passport.authenticate("google", {
    authType: "reauthenticate",
    scope: ["profile"]
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/test" }),
  async (req, res) => {
    const userid = req.user[0].dataValues.id;
    const username = req.user[0].dataValues.name;
    const token = req.user[1];
    res.json({ userid, username, token });
  }
);

router.get("/exit", function(req, res) {
  req.logout();
  res.redirect("/test");
});

module.exports = router;

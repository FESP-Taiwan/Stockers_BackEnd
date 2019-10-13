const { User } = require("../model/User");
exports.seed = async () => {
  const user = await User.build({
    email: "tes2t@test.com",
    password: "test",
    name: "test"
  });
  await user.save();
  console.log("user.seed is finish");
};

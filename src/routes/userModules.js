const express = require("express");
const router = express.Router();
const { Chips } = require("../db/model/Chip");
const { Modules } = require("../db/model/Modules");
const { checkToken } = require("../middleware/checkToken");
const { User } = require("../db/model/User");
const { Stocks } = require("../db/model/Stocks");
const { Header } = require("../db/model/Header");

router.get("/test", async (req, res) => {
  const modules = await Modules.build({
    name: "test module!",
    userId: 1
  });
  const savedModule = await modules.save();
  res.send(savedModule);
});

router.get("/test2", async (req, res) => {
  const header = await Header.build({
    headerName: "test header!",
    moduleId: 1
  });
  const savedHeader = await header.save();
  res.send(savedHeader);
});

router.get("/test3", async (req, res) => {
  const header = await Header.build({
    headerName: "test header2!",
    moduleId: 1
  });
  const savedHeader = await header.save();
  res.send(savedHeader);
});

router.get("/test4", async (req, res) => {
  const stock = await Stocks.build({
    companyName: "verybuy",
    companyNumber: 20,
    calculatedValue: 40.5,
    alertion: "買",
    rate: 20.6,
    moduleId: 1
  });
  const savedStock = await stock.save();
  res.send(savedStock);
});

router.get("/userModules/:uid", checkToken, async (req, res) => {
  try {
    const modules = await Modules.findAll({
      where: {
        userId: req.params.uid
      },
      include: [
        {
          association: Modules.hasMany(Header, { foreignKey: "moduleId" }),
          model: Header
        },
        {
          association: Modules.hasMany(Stocks, { foreignKey: "moduleId" }),
          model: Stocks
        }
      ]
    });

    res.send(modules);
  } catch {
    res.send({
      error: "Module not found"
    });
  }
});

router.post("/updateUserModules/:uid", checkToken, async (req, res) => {
  // req.params.uid
  res.send("test");
});

router.get("/chips", async (req, res) => {
  try {
    const chips = await Chips.findAll();
    res.send(chips);
  } catch {
    res.send({
      error: "chips not found"
    });
  }
});

router.post(
  "/updateModuleHeaderChips/:uid",
  checkToken,
  async (req, res) => {}
);

module.exports = router;
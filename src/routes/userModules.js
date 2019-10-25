const express = require("express");
const router = express.Router();
const { Chips } = require("../db/model/Chip");
const { Modules } = require("../db/model/Modules");
const { checkToken } = require("../middleware/checkToken");
const { User } = require("../db/model/User");
const { Stocks } = require("../db/model/Stocks");
const { Header } = require("../db/model/Header");

// router.get("/test", async (req, res) => {
//   const modules = await Modules.build({
//     name: "test module!",
//     subName: "subname",
//     userId: 1,
//     comment: {
//       comment: "test"
//     },
//     usingStock: {
//       stocks: ["stock1", "stock2"]
//     },

//     mathModule: {
//       name: "test name",
//       user: "test"
//     }
//   });
//   const savedModule = await modules.save();
//   res.send(savedModule);
// });

// router.get("/test2", async (req, res) => {
//   const header = await Header.build({
//     headerName: "test header!",
//     moduleId: 1,
//     columnId: 2,
//     chipId: 1
//   });
//   const savedHeader = await header.save();
//   res.send(savedHeader);
// });

// // router.get("/test3", async (req, res) => {
// //   const header = await Header.build({
// //     headerName: "test header2!",
// //     moduleId: 1
// //   });
// //   const savedHeader = await header.save();
// //   res.send(savedHeader);
// // });

// router.get("/test4", async (req, res) => {
//   const stock = await Stocks.build({
//     companyName: "verybuy",
//     companyNumber: 20,
//     calculatedValue: 40.5,
//     alertion: "買",
//     rate: 20.6,
//     userId: 1
//   });
//   const savedStock = await stock.save();
//   res.send(savedStock);
// });

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

router.post("/getChips", async (req, res) => {
  let promises = [];

  req.body.chips.forEach(chip => {
    promises.push(
      Chips.build({
        parentName: chip.parentName,
        chipName: chip.chipName
      }).save()
    );
  });

  Promise.all(promises).then(async () => {
    const updatedChips = await Chips.findAll();
    res.send(updatedChips);
  });
});

router.post("/updateModuleHeaderChips/:moduleId", async (req, res) => {
  await Header.destroy({
    where: {
      moduleId: req.body.moduleId
    }
  });

  let promises = [];

  req.body.headerChips.forEach(header => {
    promises.push(
      Header.build({
        headerName: header.headerName,
        moduleId: req.body.moduleId
      }).save()
    );
  });

  Promise.all(promises).then(async () => {
    const updatedHeader = await Header.findAll({
      where: {
        moduleId: req.body.moduleId
      }
    });
    res.send(updatedHeader);
  });
});

router.post("/updateCommentInfo", checkToken, async (req, res) => {
  try {
    const result = await Modules.update(
      { comment: req.body.commentInfo },
      { where: { id: req.body.moduleId } }
    );
    res.send(result);
  } catch (err) {
    res.send("something go wrong");
  }
});

router.post("/updateMathModuleInfo", checkToken, async (req, res) => {
  try {
    const results = await Modules.update(
      { mathModule: req.body.mathModuleInfo },
      { where: { id: req.body.moduleId } }
    );
    res.send(results);
  } catch (err) {
    res.send("something go wrong");
  }
});

module.exports = router;

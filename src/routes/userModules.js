const express = require("express");
const router = express.Router();
const { Chips } = require("../db/model/Chip");
const { Modules } = require("../db/model/Modules");
const { checkToken } = require("../middleware/checkToken");
const { User } = require("../db/model/User");
const { Stocks } = require("../db/model/Stocks");
const { Header } = require("../db/model/Header");

router.get("/userModules", checkToken, async (req, res) => {
  try {
    const modules = await Modules.findAll({
      where: {
        userId: req.body.userId
      },
      include: [
        {
          association: Modules.hasMany(Header, { foreignKey: "moduleId" }),
          model: Header
        }
      ]
    });

    res.status(200).send(modules);
  } catch {
    res.send({
      error: "Module not found"
    });
  }
});

router.put("/updateUserModules", checkToken, async (req, res) => {
  try {
    const modulesArr = req.body;
    // console.log("modulesArr", modulesArr);
    await Promise.all(
      modulesArr.map(async mod => {
        const updateData = {
          // id: mod.moduleId,
          name: mod.name || null,
          subName: mod.subName || null,
          userId: mod.userId || null,
          comment: mod.comment || null,
          usingStock: mod.usingStock || null,
          mathModule: mod.mathModule || null
        };
        const record = await Modules.update(updateData, {
          where: { id: mod.moduleId }
        });
        switch (record[0]) {
          case 0:
            const result = await Modules.build(mod).save();
            console.log(record[0], "success create", result.dataValues);
            break;
          case 1:
            console.log(record[0], "success update", mod);
            break;
          default:
            throw Error("!!");
        }
      })
    );
    res.status(200).json(modulesArr);
  } catch (e) {
    res.send(e);
  }
});

router.get("/chips", async (req, res) => {
  try {
    const chips = await Chips.findAll();
    res.status(200).send(chips);
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
    res.status(200).send(updatedChips);
  });
});

router.put("/updateModuleHeaderChips", checkToken, async (req, res) => {
  try {
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
          moduleId: req.body.moduleId,
          parentName: header.parentName,
          columnId: header.columnId,
          chipId: header.chipId
        }).save()
      );
    });

    Promise.all(promises).then(async () => {
      const updatedHeader = await Header.findAll({
        where: {
          moduleId: req.body.moduleId
        }
      });
      res.status(200).send(updatedHeader);
    });
  } catch (e) {
    res.send(e);
  }
});

router.put("/updateCommentInfo", checkToken, async (req, res) => {
  try {
    const result = await Modules.update(
      { comment: req.body.commentInfo },
      { where: { id: req.body.moduleId } }
    );
    res.status(200).send("update comment success");
  } catch (err) {
    res.send("something go wrong");
  }
});

router.put("/updateMathModuleInfo", checkToken, async (req, res) => {
  try {
    const results = await Modules.update(
      { mathModule: req.body.mathModuleInfo },
      { where: { id: req.body.moduleId } }
    );
    res.status(200).send("update mathmodule success");
  } catch (err) {
    res.send("something go wrong");
  }
});

module.exports = router;

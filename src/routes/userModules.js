const express = require("express");
const router = express.Router();
const { User } = require("../db/model/User");
const { Stocks } = require("../db/model/Stocks");
const { Modules } = require("../db/model/Modules");
const { Header } = require("../db/model/Header");
const { Chips } = require("../db/model/Chip");

const { checkToken } = require("../middleware/checkToken");


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

    res.status(200).send(modules);
  } catch {
    res.send({
      error: "Module not found"
    });
  }
});

router.put("/updateUserModules", checkToken, async (req, res) => {
  try {
    const modulesArr = req.body.userModulesUpdated;
    const user = await User.findAll({
      where: {
        id: modulesArr[0].userId
      }
    });
    if (user.length > 0) {
      console.log("test", modulesArr[0].userId);
    } else {
      console.log("test", modulesArr[0].userId);
      throw new Error("使用者尚未建立");
    }

    const updatedStock = await Stocks.update(
      {
        alertion: req.body.stockAlertion
      },
      {
        where: { companyNumber: req.body.stockNumber }
      }
    );

    //Comparison module id
    let newModuleIdArr = []; //input moudle id
    modulesArr.map(mod => {
      newModuleIdArr.push(mod.moduleId);
    });
    console.log("new", newModuleIdArr);
    //list all module
    let oldModuleIdArrTemp = await Modules.findAll({
      attributes: ["id"],
      where: {
        userid: modulesArr[0].userId
      }
    });
    let oldModuleIdArr = [];
    oldModuleIdArrTemp.map(item => {
      oldModuleIdArr.push(item.dataValues.id);
    });
    console.log("oldmodule", oldModuleIdArr);
    let deleteModule = [];
    oldModuleIdArr.map(item => {
      if (newModuleIdArr.indexOf(item) === -1) {
        deleteModule.push(item);
      }
    });
    console.log("delete", deleteModule);
    await Modules.destroy({ where: { id: deleteModule } });
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
            const result = await Modules.create(updateData);
            delete mod.moduleId;
            const header = await Header.bulkCreate(mod.headers);
            //await Modules.setHeaders(header);
            console.log(record[0], "success create!", result.dataValues);
            break;
          case 1:
            console.log(record[0], "success update!", mod);
            break;
          default:
            throw new Error("!!");
        }
      })
    );
    //list result
    let currentModule = await Modules.findAll({
      include: [Header],
      where: {
        userid: modulesArr[0].userId
      }
    });
    //console.log(currentModule);

    res.status(200).json(currentModule);
  } catch (e) {
    res.send(e.stack);
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

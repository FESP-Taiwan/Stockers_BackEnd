const express = require("express");
const router = express.Router();
const { Modules } = require("../db/model/Modules");

router.put("/updateUserModules", async (req, res) => {
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

module.exports = router;

/*
url:
localhost:5000/modules/updateUserModules
body:
[
    {
        "moduleId": 2,
        "name": "first",
        "subName": "fist",
        "userId": 123,
        "comment": {
            "fdsafds": "fdsafds"
        },
        "usingStock": [
            {
                "fdsa": "dd"
            }
        ],
        "mathModule": {
            "fdsafds": "fdsafds"
        }
    },
    {
        "moduleId": 1
    }
]
*/

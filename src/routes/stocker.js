var express = require("express");
var router = express.Router();
const db = require("../middleware/mongo");
const tools = require("../middleware/tools");
const bodyParser = require("body-parser");
db.connect_mongo("stocker_mongo_api");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

function api_log(str) {
  console.log(`[StockerApi]${str}`);
}
router.use(tools.info);

router.get("/", (req, res) => {
  res.set("Content-Type", "text/html");
  res.status(200).send("Api is on");
});
// GET
// stocker/all?db_name=TickerPool&collection_name=twse
router.get("/all", (req, res) => {
  console.log(`${JSON.stringify(req.query)}`);
  var db_name = req.query.db_name;
  var collection_name = req.query.collection_name;
  db.get_all(db_name, collection_name)
    .then(d => {
      api_log("Received: ");
      api_log(JSON.stringify(d));
      res.json(d);
    })
    .catch(err => {
      res.json(err);
    });
});

// POST
// stocker/insert
// body
// {
//   db_name:
//   collection_name:
//   key1:value1
//   key2:value2
//   ...
// }

router.post("/insert", (req, res) => {
  var src = req.body;
  var db_name = src.db_name;
  var collection_name = src.collection_name;
  var insert_payload = tools.packdata(req.body);
  db.insert(db_name, insert_payload)
    .then(ret => {
      console.log(ret.ops);
      res.json(ret);
    })
    .catch(err => {
      console.log(`Error: ${err}`);
      res.json(err);
    });
});

// GET
// 可以用query 或是 body
// query:
// stocker/search?db_name=TickerPool&collection_name=twse&ticker=2330 或是其他條件

// body:
//  {
//   db_name: "TickerPoll"
//   collection_name: "twse"
//   ticker: 2330
//  }

// 註： db_name 跟collection_name 一定要附

router.get("/search", (req, res) => {
  var src = req.body || req.query;
  var db_name = src.db_name;
  db.where(db_name, tools.packdata(src))
    .then(ret => {
      console.log(ret);
      res.json(ret);
    })
    .catch(err => {
      console.log(ret);
      res.json(err);
    });
});

// POST
// stocker/update
// body:
//  {
//   db_name: "TickerPoll"
//   collection_name: "twse"
//   ticker: 2330
//  }

router.post("/update", (req, res) => {
  api_log(`Updating ${JSON.stringify(req.body)}`);
  var db_name = req.body.db_name;
  var update_payload = tools.packdata(req.body);
  db.update(db_name, update_payload)
    .then(ret => {
      console.log(ret.ops);
      res.json({
        status: true,
        message: `Updated in collection \'${update_payload.collection_name}\' db:${db_name} `,
        data: `${JSON.stringify(ret)}`
      });
    })
    .catch(err => {
      api_log(err);
      res.json(err);
    });
});

// GET
// query:
// stocker/list_collections?db_name=TickerPool

router.get("/list_collections", (req, res) => {
  var src = req.query;
  var db_name = src.db_name;
  db.list_collections(db_name).then(ret => {
    api_log("All collections:");
    res.json(
      ret.map(d => {
        api_log(JSON.stringify(d.ns));
        return JSON.stringify(d.idIndex.ns);
      })
    );
  });
});

// 靜態第一個
// GET
// stocker/industryStickers

router.get("/industryStickers", (req, res) => {
  db.industryStickers(res);
});

// 靜態第二個
// 因為DB沒有上中下游的資料就刪掉第二個了
// router.get('/industry',tools.info,(req,res)=>{
//     db.industry(res);
// })
router.get("/seasonPrice/:company_no", (req,res)=>{
  console.log(req.params.company_no);
  db.seasonPrice(req.params.company_no,res);
})
// router.get("/test/:company_no",(req,res)=>{
//   console.log(req.params.company_no);
//   db.test(req.params.company_no,res);
// })
// 靜態第三個
// GET
// stocker/individualStock/2330

router.get("/individualStock/:company_no", tools.info, (req, res) => {
  console.log(req.params.company_no);
  db.individualStock(req.params.company_no, res);
});

module.exports = router;

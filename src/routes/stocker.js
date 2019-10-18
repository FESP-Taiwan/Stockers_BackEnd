var express = require('express');
var router = express.Router();
const db = require("../middleware/mongo");
const tools = require('../middleware/tools');
const bodyParser = require('body-parser')
db.connect_mongo("stocker_mongo_api");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));

function api_log(str){
    console.log(`[StockerApi]${str}`);
}

router.get('/',(req,res)=>{
    res.set('Content-Type', 'text/html');
    res.status(200).send("Api is on");
});

router.get('/all',tools.info,(req,res)=>{
    console.log(`${JSON.stringify(req.query)}`)
    var db_name = req.query.db_name;
    var collection_name = req.query.collection_name;
      db.get_all(db_name,collection_name)
      .then(d=>{
        api_log("Received: ")
        api_log(JSON.stringify(d));
        res.json(d);
      })
      .catch(err=>{
          res.json(err);
      })

});

router.post('/insert',tools.info,(req,res)=>{
    var src = req.body
    var db_name = src.db_name;
    var collection_name = src.collection_name;
    var insert_payload = tools.packdata(req.body);
    db.insert(db_name,insert_payload)
       .then(ret=>{
        console.log(ret.ops);
        res.json(ret);
    })
       .catch(err=>{
        console.log(`Error: ${err}`)
        res.json(err);
    })
});

router.get('/search',tools.info,(req,res)=>{
    var src = req.body || req.query;
    var db_name = src.db_name;
    db.where(db_name,tools.packdata(src))
      .then(ret=>{
          console.log(ret);
          res.json(ret);
        })
        .catch(err=>{
            console.log(ret);
            res.json(err);
        })

});
router.post('/update',tools.info,(req,res)=>{
    api_log(`Updating ${JSON.stringify(req.body)}`)
      var db_name = req.body.db_name;
    var collection_name = req.body.collection_name;
    var update_payload = tools.packdata(req.body);
    db.update(db_name,update_payload)
    .then(ret=>{
        console.log(ret.ops);
       res.json({status:true, message:`Updated in collection \'${update_payload.collection_name}\' db:${db_name} `,data:`${JSON.stringify(ret)}`});
    })
    .catch(err=>{
      api_log(err);
      res.json(err);
    })
})
router.get('/list_collections',(req,res)=>{
    var src = req.query;
    var db_name = src.db_name;
    // var collection_name = src.collection_name;
    db.list_collections(db_name).then(ret=>{
        api_log("All collections:");
        res.json(ret.map(d=>{
            api_log(JSON.stringify(d.ns));
            return JSON.stringify(d.idIndex.ns)
           }));
    })
 });

router.get('/industryStickers',tools.info,(req,res)=>{
    db.industryStickers(res);
})

router.get('/industry',tools.info,(req,res)=>{
    db.industry(res);
})

router.get('/stockpage_1/:ticker_id',tools.info,(req,res)=>{
    console.log(req.params.ticker_id)
    db.stockpage_1(req.params.ticker_id,res);
})
router.get('/det',tools.info,(req,res)=>{
    db.det(res);
})

module.exports = router;
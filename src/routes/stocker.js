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

router.get('/mainpage',(req,res)=>{
    var result = "";
    db.mainpage()
    .then(data=>{
          var result=[];
          for(let i = 0;i<data.length;i++){
              var id = data[i]._id;
              var recent_3m_dif = [];
              for(let j = 0;j<3;j++){
                  recent_3m_dif.push({
                      id:`${data[i]._id}_${j}`,
                      diff:data[0].recent_3m_dif[j],
                      date:data[0].date[j],
                      unit:"K $NTD"
                  })
              }
              result.push({
                  _id:data[i]._id,
                  recent_3m_dif: recent_3m_dif
              })
          }
        res.json(result);
       })   
       .catch(err=>{
           console.log(err);
           res.json(err);
       })
})

function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
module.exports = router;
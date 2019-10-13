const mongo = require('mongodb').MongoClient;
// const url = "mongodb://localhost:27017/";
const url = 'mongodb+srv://py_scrapy:scrapy@balancesheetreport-wo30d.mongodb.net/test?retryWrites=true&w=majority'
const db_name = "Report"
// const db_name = "stocker"
// const testdata = require('../../tests/testdata');

function log(str){
    console.log(`[Mongo] ${str}`)
}

function connect_mongo(src="",remote=url){
    log(`${src} Connecting to MongoDB...`);
    mongo.connect(remote,{useNewUrlParser:true,useUnifiedTopology: true})
    .then(clientobj=>{
         log(`${src} Connected to ${remote}`)
         client = clientobj;
         })
    .catch(err=>{throw err;})
}

function createCollection(db_name, name){
    log(`Connected to database: ${db_name}`);
    try{
       db_obj = client.db(db_name);
       return db_obj.createCollection(name);
    }
    catch(e){
        throw e;
    }
}

function dropCollection(db_name,collection_name){
   db_obj = client.db(db_name);
   return db_obj.collection(collection_name).drop();
}

function list_collections(db_name){
    db_obj = client.db(db_name);
    return db_obj.listCollections().toArray();
}

function filter(data){
    var newobj = {};
    for(var key in data){
        if(data[key]!="")
         {
             newobj[key]=data[key];
         }
    }
    return newobj;
}

function where(db_name, payload){
    var search_params = filter(payload.data);
    log(`Search in DB: \" ${db_name}\" collection: \"${payload.collection_name}\" query:${JSON.stringify(search_params)}`);
    db_obj = client.db(db_name);
    return db_obj.collection(payload.collection_name).find(search_params).limit(10).toArray();
}
function get_all(db_name, collection_name){
    log(`Connected to database: ${db_name}`);
    db_obj = client.db(db_name);
    return db_obj.collection(collection_name).find({}).toArray();
}

function insert(db_name,payload){
    log(`Inserting ${JSON.stringify(payload)}`)
    db_obj = client.db(db_name);
    return db_obj.collection(payload.collection_name).insertOne(payload.data);
}

function update(db_name,payload){
    log(`Update ${JSON.stringify(payload)}`);
    var update_params = payload.data.to;
    delete payload.data.to;
    db_obj = client.db(db_name);
    return db_obj.collection(payload.collection_name).updateOne(payload.data,{$set:update_params});
}

function renderjson(res, data){
    res.send(JSON.stringify(data,null,2));
}
//Routes
function industryStickers(res){
    db_obj = client.db("StockPrice");
    var d = new Date();
    d.setMonth(d.getMonth() - 2);
    db_obj.collection("twse").aggregate([
        {$match:{date:{$gte: d}}},
            {
                $group:{
                  _id: {
                     stockno:"$stockno",
                     month:{$month:"$date"},
                    },
                    closes:{$push:"$close"},
            }
        },
        {
            $group:{
                _id:"$_id.stockno",
                payload:{ $push:{
                       month:"$_id.month",
                       close_asc:"$closes"
                  }
                }
            }
        },
        {$sort:{"_id":-1,"month":1}},
    ]).toArray()
    .then(async(cluster)=>{
        let proms = cluster.map(async function(doc){
            var stock = [];
            for(let j =0;j<doc.payload.length;j++){
                var close_sum=0.0;
                for(let k = 0;k<doc.payload[j].close_asc.length-1 ;k++){
                    close_sum += (doc.payload[j].close_asc[k+1] - doc.payload[j].close_asc[k]) / doc.payload[j].close_asc[k];
                }
                stock.push({
                    month: doc.payload[j].month,
                    gain: close_sum,
                    unit:"％"
                });
            }

            const r = await client.db("TickerPool").collection("twse").find({ticker:doc._id}).toArray()
            .then(ticker=>{
                var total_gain = 0.0;
                for(let d = 0;d < stock.length;d++){
                    total_gain+=stock[d].gain;
                }
                return({
                    stockno: doc._id,
                    industry_name: ticker[0].industry_type,
                    industry_gain: total_gain,
                    gain_diff: stock
                });
            })
            .catch(err=>{
                res.send(err);
            })
            return r;
        })

        Promise.all(proms).then((results) => {
            res.send(JSON.stringify(results,null,2));
        });
    })
    .catch(err=>{
        res.send(err);
    })
}
function industry(res){
  client.db("TickerPool").collection("twse")
  .find({})
//   .aggregate([
    //   {
    //       $group:{
    //       _id: "$industry_type"
    //   }
    // }
//   ])
  .toArray()
  .then(data=>{
    renderjson(res, data);
  })
  .catch(err=>{
      renderjson(res,err);
  })
}
function stockpage_1(){
    db_obj = client.db("Report");
    return db_obj.collection("BalanceSheet").aggregate([
        {$sort:{"report_date":-1}}
        ,{
            $group:{
            _id:"$ticker",
            資產負債表資料:{
                  $push:{
                    id:"$_id",
                    日期:"$report_date",
                    單位:{$literal:"K $NTD"},
                    現金及約當現金:"$ 現金及約當現金",
                    存放央行及拆借金融同業:"$ 存放央行及拆借金融同業",
                    透過損益按公允價值衡量之金融資產:"$  透過損益按公允價值衡量之金融資產",
                    "備供出售金融資產－淨額":"$ 備供出售金融資產－淨額",
                    避險之衍生金融資產:"$ 避險之衍生金融資產",
                    附賣回票券及債券投資:"$ 附賣回票券及債券投資",
                    "應收款項－淨額":"$ 應收款項－淨額",
                    當期所得稅資產:"$ 當期所得稅資產",
                    當期所得稅資產合計:"$ 當期所得稅資產合計",
                    "貼現及放款－淨額": "1187270486",
                    "再保險合約資產－淨額": "$ 再保險合約資產－淨額",
                    "持有至到期日金融資產－淨額": "$ 持有至到期日金融資產－淨額",
                    "採用權益法之投資－淨額": "$ 採用權益法之投資－淨額",
                    "其他金融資產－淨額": "$ 其他金融資產－淨額",
                    "投資性不動產－淨額": "$ 投資性不動產－淨額",
                    "不動產及設備－淨額": "$ 不動產及設備－淨額",
                    "無形資產－淨額": "$ 無形資產－淨額",
                    "遞延所得稅資產": "$ 遞延所得稅資產",
                    "其他資產－淨額": "$ 其他資產－淨額",
                    "資產總額": "$ 資產總額",
                    "負債": "$ 負債",
                    "央行及金融同業存款": "$ 央行及金融同業存款",
                    "央行及同業融資": "$ 央行及同業融資",
                    "透過損益按公允價值衡量之金融負債": "$ 透過損益按公允價值衡量之金融負債",
                    "避險之衍生金融負債": "$ 避險之衍生金融負債",
                    "附買回票券及債券負債": "$ 附買回票券及債券負債",
                    "應付款項": "$ 應付款項",
                    "應付款項合計": "$ 應付款項合計",
                    "當期所得稅負債": "$ 當期所得稅負債",
                    "存款及匯款": "$ 存款及匯款",
                    "應付債券": "$ 應付債券",
                    "負債準備": "$ 負債準備",
                    "負債準備合計": "$ 負債準備合計",
                    "其他金融負債": "$ 其他金融負債",
                    "其他金融負債合計": "$ 其他金融負債合計",
                    "遞延所得稅負債": "$ 遞延所得稅負債",
                    "遞延所得稅負債合計": "$ 遞延所得稅負債合計",
                    "其他負債": "$ 其他負債",
                    "其他負債合計": "$ 其他負債合計",
                    "負債總額": "$ 負債總額",
                    "權益 ": "$ 權益",
                    "歸屬於母公司業主之權益 ": "$ 歸屬於母公司業主之權益",
                    "股本": "$ 股本",
                    "普通股股本": "$ 普通股股本",
                    "特別股股本": "$ 特別股股本",
                    "預收股本": "$ 預收股本",
                    "股本合計": "$ 股本合計",
                    "資本公積": "$ 資本公積",
                    "保留盈餘": "$ 保留盈餘",
                    "法定盈餘公積": "$ 法定盈餘公積",
                    "特別盈餘公積": "$ 特別盈餘公積",
                    "未分配盈餘（或待彌補虧損）": "$ 未分配盈餘（或待彌補虧損）",
                    "保留盈餘合計": "$ 保留盈餘合計",
                    "其他權益": "$ 其他權益",
                    "其他權益合計": "$ $ 其他權益合計",
                    "歸屬於母公司業主之權益合計": "歸屬於母公司業主之權益合計",
                    "非控制權益": "$ 非控制權益",
                    "權益總額": "$ 權益總額",
                    "預收股款（股東權益項下）之約當發行股數（單位：股）": "$ 預收股款（股東權益項下）之約當發行股數（單位：股）",
                    "母公司暨子公司所持有之母公司庫藏股股數（單位：股）": "$ 母公司暨子公司所持有之母公司庫藏股股數（單位：股）"
                  }
              }
            }
        }
    ]).toArray()

    // return db_obj.collection("BalanceSheet").find({}).toArray();
}

module.exports = {
   connect_mongo,
   list_collections,
   insert,
   get_all,
   where,
   createCollection,
   dropCollection,
   update,
   industryStickers,
   industry,
   stockpage_1,
};
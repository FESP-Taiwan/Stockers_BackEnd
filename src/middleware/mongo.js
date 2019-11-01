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

function renderJson(res, data){
    if(!client){
           res.send("client is not ready")
    }
    else
    {
          res.send(JSON.stringify(data,null,2));
    }
}
function clog(data){
    console.log(JSON.stringify(data,null,2));
}
//Routes
function industryStickers(res){
    db_obj = client.db("StockPrice");
    var d = new Date();
    d.setMonth(d.getMonth() - 2);
    d.setDate(0);
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
                    name:ticker[0].name,
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

        Promise.all(proms).then((unparsedRes) => {
            var industry_types = [...new Set(unparsedRes.map(company=>{
                return company.industry_name
            }))]
            var parsedRes = []
            industry_types.forEach(industry_type=>{
                var industry = {
                    industry_type,
                    companies: [...new Set(unparsedRes.map(company=>{
                        if(company.industry_name==industry_type)
                        return {
                            stockNo:company.stockno,
                            name:company.name,
                            gain_diff:company.gain_diff
                        }
                    }))].filter(docAfterMap=> docAfterMap!=null)
                }
                parsedRes.push(industry);
            })
            console.log(parsedRes.length);
            res.send(JSON.stringify(parsedRes,null,2));
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
    renderJson(res, data);
  })
  .catch(err=>{
      renderJson(res,err);
  })
}
async function individualStock(ticker_id,res){
    var d = new Date();
    d.setFullYear(d.getFullYear()-2);
    try{
        var stockInfo = await client.db('TickerPool').collection("twse").findOne({ticker:`${ticker_id}`})
        // let uniq = tickers => [...new Set(tickers)];//超屌ES6語法，set會直接忽略重複值，再展開
        // clog(uniq(tickers))
        // clog(tickers);

        var comprehensive = await client.db("Report").collection("ComprehensiveIncom").aggregate([
                {$match:{
                    ticker:`${ticker_id}`
                }},
                // {
                //     $group:{
                //         "_id": "$ticker",
                //         data:{
                //             $push:{
                //                 id:"$_id",
                //                 "code": "$code",
                //                 "report_date": "$report_date",
                //                 "營業活動之現金流量－間接法":                      "$營業活動之現金流量－間接法",
                //                 "繼續營業單位稅前淨利（淨損）":                    "$繼續營業單位稅前淨利（淨損）",
                //                 "本期稅前淨利（淨損）":                           "$本期稅前淨利（淨損）",
                //                 "調整項目":                                     "$調整項目",
                //                 "收益費損項目":                                  "$收益費損項目",
                //                 "折舊費用":                                     "$折舊費用 ",
                //                 "攤銷費用":                                      "$攤銷費用 ",
                //                 "透過損益按公允價值衡量金融資產及負債之淨損失（利益）": "$透過損益按公允價值衡量金融資產及負債之淨損失（利益）",
                //                 "利息費用":                                      "$利息費用",
                //                 "利息收入":                                      "$利息收入",
                //                 "股利收入":                                      "$股利收入",
                //                 "採用權益法認列之關聯企業及合資損失（利益）之份額":     "$採用權益法認列之關聯企業及合資損失（利益）之份額",
                //                 "處分及報廢不動產、廠房及設備損失（利益）":            "$處分及報廢不動產、廠房及設備損失（利益）",
                //                 "處分投資性不動產損失（利益）":                      "$處分投資性不動產損失（利益）",
                //                 "非金融資產減損損失":                              "$非金融資產減損損失",
                //                 "收益費損項目合計":                                "$收益費損項目合計",
                //                 "與營業活動相關之資產／負債變動數":                   "$與營業活動相關之資產／負債變動數",
                //                 "與營業活動相關之資產之淨變動":                      "$與營業活動相關之資產之淨變動",
                //                 "強制透過損益按公允價值衡量之金融資產（增加）減少":     "$強制透過損益按公允價值衡量之金融資產（增加）減少",
                //                 "應收票據（增加）減少":                             "$應收票據（增加）減少",
                //                 "應收帳款（增加）減少":                             "$應收帳款（增加）減少",
                //                 "其他應收款（增加）減少":                           "$其他應收款（增加）減少",
                //                 "存貨（增加）減少":                                "$存貨（增加）減少",
                //                 "預付款項（增加）減少":                             "$其他流動資產（增加）減少",
                //                 "其他流動資產（增加）減少":                          "$其他流動資產（增加）減少",
                //                 "與營業活動相關之資產之淨變動合計":                   "$與營業活動相關之資產之淨變動合計",
                //                 "與營業活動相關之負債之淨變動":                      "$與營業活動相關之負債之淨變動",
                //                 "合約負債增加（減少）":                             "$合約負債增加（減少）",
                //                 "應付票據增加（減少）":                             "$應付票據增加（減少）",
                //                 "應付帳款增加（減少）":                             "$應付帳款增加（減少）",
                //                 "其他應付款增加（減少）":                           "$其他應付款增加（減少）",
                //                 "其他流動負債增加（減少）":                          "$其他流動負債增加（減少）",
                //                 "淨確定福利負債增加(減少)":                         "$淨確定福利負債增加(減少)",
                //                 "與營業活動相關之負債之淨變動合計":                   "$與營業活動相關之負債之淨變動合計",
                //                 "與營業活動相關之資產及負債之淨變動合計":              "$與營業活動相關之資產及負債之淨變動合計",
                //                 "調整項目合計":                                    "$調整項目合計",
                //                 "營運產生之現金流入（流出）":                        "$營運產生之現金流入（流出） ",
                //                 "退還（支付）之所得稅":                             "$退還（支付）之所得稅",
                //                 "營業活動之淨現金流入（流出）": "$營業活動之淨現金流入（流出）",
                //                 "投資活動之現金流量":"$投資活動之現金流量",
                //                 "取得透過其他綜合損益按公允價值衡量之金融資產": "$ 取得透過其他綜合損益按公允價值衡量之金融資產",
                //                 "處分透過其他綜合損益按公允價值衡量之金融資產": "$處分透過其他綜合損益按公允價值衡量之金融資產",
                //                 "取得採用權益法之投資": "$取得採用權益法之投資",
                //                 "取得不動產、廠房及設備":"$取得不動產、廠房及設備",
                //                 "處分不動產、廠房及設備":"$處分不動產、廠房及設備" ,
                //                 "預收款項減少－處分資產": "$預收款項減少－處分資產",
                //                 "其他應收款減少": "$其他應收款減少",
                //                 "處分投資性不動產": "$處分投資性不動產",
                //                 "長期應收租賃款減少": "$長期應收租賃款減少",
                //                 "其他金融資產減少": "$其他金融資產減少",
                //                 "其他非流動資產增加": "$其他非流動資產增加",
                //                 "收取之利息": "$收取之利息",
                //                 "收取之股利": "$收取之股利",
                //                 "其他投資活動": "$其他投資活動",
                //                 "投資活動之淨現金流入（流出）": "$投資活動之淨現金流入（流出）",
                //                 "籌資活動之現金流量": "$籌資活動之現金流量",
                //                 "短期借款增加": "$短期借款增加 ",
                //                 "短期借款減少": "$短期借款減少",
                //                 "應付短期票券增加": "$應付短期票券增加",
                //                 "償還公司債": "$償還公司債",
                //                 "償還長期借款": "$償還長期借款",
                //                 "其他應付款－關係人增加": "$其他應付款－關係人增加",
                //                 "其他應付款－關係人減少": "$其他應付款－關係人減少",
                //                 "應付租賃款減少": "$應付租賃款減少",
                //                 "租賃本金償還": "$租賃本金償還",
                //                 "其他非流動負債減少": "$其他非流動負債減少",
                //                 "發放現金股利": "$發放現金股利",
                //                 "支付之利息": "$支付之利息",
                //                 "非控制權益變動": "$非控制權益變動",
                //                 "籌資活動之淨現金流入（流出）": "$籌資活動之淨現金流入（流出）",
                //                 "匯率變動對現金及約當現金之影響": "$匯率變動對現金及約當現金之影響",
                //                 "本期現金及約當現金增加（減少）數": "$本期現金及約當現金增加（減少）數",
                //                 "期初現金及約當現金餘額": "$期初現金及約當現金餘額",
                //                 "期末現金及約當現金餘額": "$期末現金及約當現金餘額",
                //                 "資產負債表帳列之現金及約當現金": "$資產負債表帳列之現金及約當現金",
                //                 "year": "$year",
                //                 "season": "$season"
                //             }
                //         }

                //    }
                // }
            ]
        ).toArray()
        comprehensiveData = await comprehensive

        var balanceSheet = await client.db("Report").collection("BalanceSheet").aggregate([
            // {$limit:3},
            {$match:{
                    ticker:ticker_id
            }}
            // ,{
            //     $group:{
            //     _id:"$ticker",
            //     data:{
            //         $push:{
            //             id:"$_id",
            //             date:"$report_date",
            //             unit:{$literal:"K $NTD"},
            //             "資產":"",
            //             "流動資產":"$流動資產",
            //             "現金及約當現金":"$現金及約當現金",
            //             "現金及約當現金合計": "$現金及約當現金合計",
            //             "透過損益按公允價值衡量之金融資產－流動":"$透過損益按公允價值衡量之金融資產－流動",
            //             "透過損益按公允價值衡量之金融資產－流動合計": "$透過損益按公允價值衡量之金融資產－流動合計",
            //             "備供出售金融資產－流動":"$備供出售金融資產－流動",
            //             "備供出售金融資產－流動淨額": "$備供出售金融資產－流動淨額",
            //             "應收票據淨額": "$應收票據淨額",
            //             "應收帳款淨額": "$應收帳款淨額",
            //             "應收帳款－關係人淨額": "$應收帳款－關係人淨額",
            //             "其他應收款":"$其他應收款",
            //             "其他應收款淨額": "$其他應收款淨額",
            //             "其他應收款－關係人": "$其他應收款－關係人",
            //             "其他應收款－關係人淨額": "$其他應收款－關係人淨額",
            //             "存貨": "$存貨",
            //             "存貨合計":"$存貨合計",
            //             "預付款項":"$預付款項",
            //             "預付款項合計": "$預付款項合計",
            //             "其他流動資產":"$其他流動資產",
            //             "其他金融資產－流動": "$其他金融資產－流動",
            //             "其他流動資產－其他": "$其他流動資產－其他",
            //             "其他流動資產合計": "$其他流動資產合計",
            //             "流動資產合計": "$流動資產合計",
            //             "非流動資產":"$非流動資產",
            //             "備供出售金融資產－非流動":"$備供出售金融資產－非流動",
            //             "備供出售金融資產－非流動淨額": "$備供出售金融資產－非流動淨額",
            //             "以成本衡量之金融資產－非流動":"$以成本衡量之金融資產－非流動",
            //             "以成本衡量之金融資產－非流動淨額": "$以成本衡量之金融資產－非流動淨額",
            //             "採用權益法之投資":"$採用權益法之投資",
            //             "採用權益法之投資淨額": "$採用權益法之投資淨額",
            //             "不動產、廠房及設備":"$不動產、廠房及設備",
            //             "不動產、廠房及設備合計": "$不動產、廠房及設備合計",
            //             "投資性不動產淨額": "$投資性不動產淨額",
            //             "無形資產":"$無形資產",
            //             "無形資產合計": "$無形資產合計",
            //             "其他非流動資產":"$其他非流動資產",
            //             "預付設備款": "$預付設備款",
            //             "長期應收票據及款項":"$長期應收票據及款項",
            //             "長期應收租賃款": "$長期應收租賃款",
            //             "長期應收票據及款項淨額": "$長期應收票據及款項淨額",
            //             "預付投資款": "$預付投資款",
            //             "長期預付租金": "$長期預付租金",
            //             "其他非流動資產－其他": "$其他非流動資產－其他",
            //             "其他非流動資產－其他合計": "$其他非流動資產－其他合計",
            //             "其他非流動資產合計": "$其他非流動資產合計",
            //             "非流動資產合計": "$非流動資產合計",
            //             "資產總額": "$資產總額",
            //             "負債":"$負債",
            //             "流動負債":"$流動負債",
            //             "短期借款":"$短期借款",
            //             "短期借款合計": "$短期借款合計",
            //             "應付短期票券":"$應付短期票券",
            //             "應付短期票券合計": "$應付短期票券合計",
            //             "應付帳款":"$應付帳款",
            //             "應付帳款合計":"$應付帳款合計",
            //             "應付帳款－關係人":"$應付帳款－關係人",
            //             "應付帳款－關係人合計": "$應付帳款－關係人合計",
            //             "其他應付款":"$其他應付款",
            //             "其他應付款－其他": "$其他應付款－其他",
            //             "其他應付款合計": "$其他應付款合計",
            //             "當期所得稅負債": "$當期所得稅負債",
            //             "其他流動負債":"$其他流動負債",
            //             "預收款項":"$預收款項",
            //             "預收款項合計":"$預收款項合計" ,
            //             "一年或一營業週期內到期長期負債":"$一年或一營業週期內到期長期負債",
            //             "一年或一營業週期內到期長期負債合計": "$一年或一營業週期內到期長期負債合計",
            //             "其他流動負債－其他":"$其他流動負債－其他",
            //             "其他流動負債合計": "$其他流動負債合計",
            //             "流動負債合計": "$流動負債合計",
            //             "非流動負債":"$非流動負債",
            //             "應付公司債":"$應付公司債",
            //             "應付公司債合計": "$應付公司債合計",
            //             "長期借款":"$長期借款",
            //             "長期借款合計": "$長期借款合計",
            //             "遞延所得稅負債":"$遞延所得稅負債",
            //             "遞延所得稅負債合計":"$遞延所得稅負債合計" ,
            //             "其他非流動負債":"$其他非流動負債",
            //             "應計退休金負債（應付退休金費用）": "$應計退休金負債（應付退休金費用）",
            //             "其他非流動負債－其他": "$其他非流動負債－其他",
            //             "其他非流動負債合計": "$其他非流動負債合計",
            //             "非流動負債合計":"$非流動負債合計",
            //             "負債總額": "$負債總額",
            //             "權益":"$權益",
            //             "歸屬於母公司業主之權益":"$歸屬於母公司業主之權益",
            //             "股本":"$股本",
            //             "普通股股本":"$普通股股本",
            //             "股本合計": "$股本合計",
            //             "資本公積":"$資本公積",
            //             "資本公積合計": "$資本公積合計",
            //             "保留盈餘":"$保留盈餘",
            //             "法定盈餘公積":"$法定盈餘公積" ,
            //             "特別盈餘公積":"$特別盈餘公積" ,
            //             "未分配盈餘（或待彌補虧損）":"$未分配盈餘（或待彌補虧損）",
            //             "未分配盈餘（或待彌補虧損）合計": "$未分配盈餘（或待彌補虧損）合計",
            //             "保留盈餘合計": "$保留盈餘合計",
            //             "其他權益":"$其他權益",
            //             "其他權益合計": "$其他權益合計",
            //             "歸屬於母公司業主之權益合計": "$歸屬於母公司業主之權益合計",
            //             "非控制權益": "$非控制權益",
            //             "權益總額": "$權益總額",
            //             "預收股款（權益項下）之約當發行股數":"$預收股款（權益項下）之約當發行股數" ,
            //             "母公司暨子公司所持有之母公司庫藏股股數（單位：股）":"$母公司暨子公司所持有之母公司庫藏股股數（單位：股）" ,
            //         }                   }
            //     }
            // },
            // {  $sort:{_id:1}   }
            // ,{$project:{
            //     _id:"$_id"
            // }}
        ]).toArray()
        var balanceSheetData = balanceSheet

        var cashflow = await client.db("Report").collection("CashFlow").aggregate([
            {$match:{
                ticker:ticker_id
            }}
        ]).toArray()

        // clog(cashflow);
        var dividend = await client.db("Dividend").collection("histock").aggregate([
            {$match:{
                ticker:ticker_id
            }}
            // {
            //     $group:{
            //         _id:"$ticker",
            //         dividend:{
            //             $push:{
            //                 "belongs_year":          "$belongs_year",
            //                 "pay_year":              "$pay_year",
            //                 "ex_right_date":         "$ex_right_date",
            //                 "ex_dividend_date":      "$ex_dividend_date" ,
            //                 "price_before_dividend": "$price_before_dividend",
            //                 "stock_dividend":        "$stock_dividend"       ,
            //                 "cash_dividend":         "$cash_dividend"        ,
            //             }
            //         }
            //     }
            // },
            // {$sort:{_id:1}}
            // ,{$project:{
            //   _id:"$_id"
            // }}
        ]).toArray()

        // clog(await dividend);
        var stock = {
            company_id:ticker_id,
            company_name:stockInfo.name,
            ComprehensiveIncom: await comprehensiveData,
            BalanceSheet:await balanceSheetData,
            CashFlow:await cashflow,
            Dividend:await dividend,
        };
        renderJson(res,stock)

    }
    catch(rejected){
        renderJson(res, rejected);
    }
}
async function seasonPrice(company_no, res){
    //可以跟你要最近一年以季為單位區分的收盤價嗎
    var prices = await client.db("StockPrice").collection("twse").aggregate([
        {
            $match:{
              stockno: company_no,
            }
        },
        {
            $project:{
                _id: "$stockno",
                close_id: "$_id",
                date: "$date",
                isFirst:{ $eq:[{$dayOfMonth:"$date"}, 1]},
                isSeasonMonth:{$or:[{ $eq:[{$month:"$date"}, 3]}, { $eq:[{$month:"$date"}, 6]},{ $eq:[{$month:"$date"}, 9]},{ $eq:[{$month:"$date"}, 12]}]},
                close: "$close"
            },
        },
        {
             $match:{
                 isFirst:true,
                 isSeasonMonth:true
             }
        },
        {
          $project:{
              _id: "$_id",
              close_id: "$close_id",
              date: "$date",
              year: {$year:"$date"},
              close: "$close"
          }
       },

       {
           $group:{
              _id: {
                  stockno:"$_id",
                  year:"$year"
                },
                seasonalClose:{
                  $push:{
                    id:"$close_id",
                    date: "$date",
                    close: "$close"
                  }
                }
           }
       },
       {
        $sort:{
            "_id.year":1
        }
       },
       {
        $group:{
              _id:"$_id.stockno",
              Inyear:{$push:{
                year:"$_id.year",
                seasonalClose:"$seasonalClose"
              }}
        }
       },
    ]).toArray()
    clog(prices);
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
   individualStock,
   seasonPrice
};
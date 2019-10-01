const mongo = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
// const url = 'mongodb+srv://py_scrapy:scrapy@balancesheetreport-wo30d.mongodb.net/test?retryWrites=true&w=majority'
// const db_name = "Report"
const db_name = "stocker"
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
    return db_obj.collection(payload.collection_name).find(search_params).toArray();
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


module.exports = {
   connect_mongo,
   list_collections,
   insert,
   get_all,
   where,
   createCollection,
   dropCollection,
   update
};
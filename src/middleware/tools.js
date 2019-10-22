function info(req,res,next){
    res.header("Content-Type",'application/json');
    res.header("Access-Control-Allow-Origin",'*');
    console.log("Path: "+req.path);
    console.log(`Body: ${((req.body.size>0))? req.body:"empty"}`);
    next();
}
function packdata(params){
    var collection_name = params.collection_name;
    delete params.collection_name;
    delete params.db_name;
    return {
        collection_name:collection_name,
        data: params
    };
}
function isEmpty(json){
    // for(var key in json){
    //     if(json[key])
    // }
}
module.exports = {
    info,
    packdata,
    isEmpty,
}
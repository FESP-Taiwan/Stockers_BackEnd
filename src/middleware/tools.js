function info(req,res,next){
    console.log("Path: "+req.path);
    console.log("Body: ");
    console.log(req.body);
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
module.exports = {
    info,
    packdata
}
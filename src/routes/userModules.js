let express = require('express');
let router = express.Router();
let { Chips } = require('../db/model/Chip');
let { Modules } = require('../db/model/Modules');

// router.get('/test', async(req, res) => {
// 	const modules= await Modules.build({
// 		name: 'test module!',
// 		userId: 1
// 	});
// 	const savedModule = await modules.save();
// 	res.send(savedModule);
// })


router.get('/userModules', async(req,res) => {

})

router.post('/updateUserModules', async(req,res) => {
	console.log(req.header('Authorization'));
	res.send('test')
})

router.get('/chips', async(req,res) => {

})

router.post('/updateModuleHeaderChips', async(req,res) => {

})

module.exports = router;
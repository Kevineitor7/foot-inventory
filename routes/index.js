const express = require('express');
const router = express.Router();

const itemController = require("../controllers/itemController");
const categoryController = require("../controllers/categoryController")

/* GET home page. */
router.get('/', categoryController.index);

router.get('/Item/:id/ImageUpload', itemController.uploadImage_get)

router.post('/Item/:id/ImageUpload', itemController.uploadImage_post)

router.get('/Item/Create', itemController.itemCreate_get)

router.post('/Item/Create', itemController.itemCreate_post)

router.get('/Item/:id/Delete', itemController.itemDelete_get)

router.post('/Item/:id/Delete', itemController.itemDelete_post)

router.get('/Item/:id/Edit', itemController.itemEdit_get)

router.post('/Item/:id/Edit', itemController.itemEdit_post)

router.get('/Item/:id', itemController.item)

router.get('/Category/Create', categoryController.categoryCreate_get)

router.post('/Category/Create', categoryController.categoryCreate_post)

router.get('/:name/:id/Delete', categoryController.categoryDelete_get)

router.post('/:name/:id/Delete', categoryController.categoryDelete_post)

router.get('/:name/:id/Edit', categoryController.categoryEdit_get)

router.post('/:name/:id/Edit', categoryController.categoryEdit_post)

router.get('/:name/:id', categoryController.categoryItems)

router.get('/Kits', categoryController.allKits)

router.get('/Balls', categoryController.allBalls)

router.get('/Shoes', categoryController.allShoes)

router.get('/All', categoryController.allItems)


module.exports = router;
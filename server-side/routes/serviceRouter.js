const express = require('express')
const router = express.Router()
const serviceController = require('../controller/serviceController')
const upload = require('../middleware/upload')

router.post('/add-category', serviceController.addServiceCategory)
router.post('/add-services', upload.array('photos', 10), serviceController.addServices)
router.get('/fetch-services/:serviceCategoryId', serviceController.fetchServiceDetails)
router.get('/fetch-services/:serviceCategoryId/:serviceId', serviceController.fetchServiceDetailsByServiceId)
router.patch('/edit-services/:id/:serviceId', serviceController.editServiceDetails)
router.get('/fetch-all-category', serviceController.getAllServiceCategory);

module.exports = router
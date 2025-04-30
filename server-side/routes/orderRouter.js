const express = require('express')
const router = express.Router()
const orderController = require('../controller/orderController')
const upload = require('../middleware/upload')

router.post("/create-order/:clientId", orderController.createOrder)
router.post("/add-photos/:orderDetailsId", upload.array('photos', 20), orderController.addPhotosForOrders)
router.get("/get-order-details/:clientId", orderController.getOrdersByClientId)



module.exports = router
const express = require('express')
const router = express.Router()
const orderController = require('../controller/orderController')
const upload = require('../middleware/upload')

router.post("/create-order/:clientId", orderController.createOrder)
router.post("/add-photos/:orderDetailsId", upload.array('photos', 20), orderController.addPhotosForOrders)
router.post("/create-order-delivery/:orderId", orderController.createOrderDelivery)
router.get("/get-order-details/:clientId", orderController.getOrdersByClientId)
router.get("/get-delivery-details/:orderId", orderController.fetchDeliveryDetails)
router.patch("/change-status/:orderDetailsId", orderController.changeStatus)
router.get("/get-all-order-details",orderController.fetchAllOrderDetails);

router.post("/add-edited-photos/:orderDetailsId", upload.array('photos', 1), orderController.addEditedPhotos)
router.get("/view-edited-photo/:orderDetailsId", orderController.viewEditedPhoto)

module.exports = router

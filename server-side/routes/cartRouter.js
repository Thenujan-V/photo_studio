const express = require('express')
const router = express.Router()
const cartController = require('../controller/cartController')

router.post('/add-to-cart/:clientId/:categoryId/:serviceId', cartController.addToCart)
router.get('/get-from-cart/:clientId', cartController.getFromCart)
router.patch('/quantity-change/:cartId', cartController.changeQuantity)
router.delete('/delete-cart/:cartId', cartController.deleteCart)



module.exports = router

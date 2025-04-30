const express = require('express')
const router = express.Router()
const clientController = require('../controller/clientController')

router.post('/client-register', clientController.registerClient)
router.post('/client-login', clientController.loginClient)
router.get('/get-client/:id', clientController.getClientDetails)
router.get('/get-all-client', clientController.getAllClientDetails)
router.patch('/edit-details/:id', clientController.editClientDetails)
router.delete('/delete-client/:id', clientController.deleteClient)





module.exports = router
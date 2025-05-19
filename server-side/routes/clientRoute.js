const express = require('express')
const router = express.Router()
const clientController = require('../controller/clientController')

router.post('/client-register', clientController.registerClient)
router.post('/admin-register', clientController.registerAdmin)
router.post('/client-login', clientController.loginClient)
router.get('/get-client/:id', clientController.getClientDetails)
router.get('/get-all-client', clientController.getAllClientDetails)
router.put('/edit-details/:id', clientController.editClientDetails)
router.patch('/update-password/:id', clientController.passwordUpdate)
router.delete('/delete-client/:id', clientController.deleteClient)





module.exports = router
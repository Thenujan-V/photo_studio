const serviceModel = require('../models/serviceModel')

const addServiceCategory = async(req, res) => {
    try{
            const { category_name } = req.body
    
            const checkExistingService = await serviceModel.findByCategoryName(category_name)
            
            if(checkExistingService.length > 0){
                return res.status(409).json({message: "Service already exist."})
            }
    
            const result = await serviceModel.serviceCategoryAdd(category_name)

            return res.status(201).json({
                message: 'Category name saved successfully.',
                result
            })
        }catch(err){
            console.log('Error when save client.', err)
            return res.status(500).json({
                message: 'Internal server error. Faild to create client.'
            })
        }

}

const getAllServiceCategory = async (req, res) => {
    try{
        const serviceCategories = await serviceModel.findAllServiceCategory();
        console.log("service:",serviceCategories);
        res.status(201).json({
                message: 'Service added successfully.',
                serviceCategories
            });
    }catch(err){
        console.log('Error when fetch serviceCategory.', err)
            return res.status(500).json({
                message: 'Internal server error. Faild to create client.'
            })
    }
}

const addServices = async (req, res) => {
    try{
        const serviceCategoryId = req.body.service_category_id
        
        const categoryName = await serviceModel.findNameById(serviceCategoryId)

        if(categoryName?.length > 0 && categoryName[0]?.category_name === 'photosoot'){
            const {photoshoot_name, price, durarion, description, service_category_id} = req.body

            const existingPhotoshootName = await serviceModel.findByPhotoShootName(photoshoot_name)

            const files = req.files

            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'At least one photo is required.' });
            }

            if(existingPhotoshootName.length > 0){
                return res.status(409).json({message: "Service already exist."})
            }

            const service = await serviceModel.createPhotoShootServices({photoshoot_name, price, durarion, description, service_category_id})

            const file_paths = files.map(file => file.filename)

            await serviceModel.addServicePhotos({file_paths, serviceCategoryId, service_id:service.insertId})

            res.status(201).json({
                message: 'Service added successfully.',
            });
    

        }

        if(categoryName[0].category_name === 'printings'){
            const {printing_name, price, description, service_category_id} = req.body

            const existingPrintingName = await serviceModel.findByPrintingName(printing_name)

            const files = req.files

            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'At least one photo is required.' });
            }

            if(existingPrintingName.length > 0){
                return res.status(409).json({message: "Service already exist."})
            }

            const service = await serviceModel.createPrintingServices({printing_name, price, description, service_category_id})

            const file_paths = files.map(file => file.filename)

            await serviceModel.addServicePhotos({file_paths, serviceCategoryId, service_id:service.insertId})

            res.status(201).json({
                message: 'Service added successfully.',
            });
    
        }

        if(categoryName[0].category_name === 'frame making'){
            const { material_name, size, color, price, description, service_category_id } = req.body

            // const frameMeterialData = {
            //     material_name,
            //     service_category_id
            // }

            const existingMeterial = await serviceModel.findByMeterialName(material_name)

            const files = req.files

            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'At least one photo is required.' });
            }

            if(existingMeterial.length > 0){
                return res.status(409).json({message: "Service already exist."})
            }

            // const service = await serviceModel.createFramMakingService(frameMeterialData)

            const frameDetailsData = {
                material_name,
                size,
                color,
                price,
                description,
                service_category_id,
                
            }

            const serviceDetails = await serviceModel.createFramesDetails(frameDetailsData)

            const file_paths = files.map(file => file.filename)

            await serviceModel.addServicePhotos({file_paths, serviceCategoryId, service_id:serviceDetails.insertId})

            res.status(201).json({
                message: 'Service added successfully.',
            });
    
        }

    }catch(err){
        console.log('Error when save services.', err)
        return res.status(500).json({
            message: 'Internal server error.'
        })
    }
}

const fetchServiceDetails = async(req, res) => {
    try{
        const { serviceCategoryId } = req.params

        const categoryName = await serviceModel.findNameById(serviceCategoryId)

        if(categoryName?.length > 0 && categoryName[0]?.category_name === 'photosoot' ){
            const services = await serviceModel.fetchPhotoShootDetails()
            if(services.length === 0){
                return res.status(204).json({message: "there is no services."})
            }
            const servicesDetails = {
                serviceCategory: "photoshoot",
                services
            }
            
            res.status(200).json({message: "successfully fetched.", servicesDetails})
        }
        if(categoryName?.length > 0 && categoryName[0]?.category_name === 'printings' ){
            const services = await serviceModel.fetchPrintingDetails()
            if(services.length === 0){
                return res.status(204).json({message: "there is no services."})
            }
            const servicesDetails = {
                serviceCategory: "printings",
                services
            }
    
            res.status(200).json({message: "successfully fetched.", servicesDetails})
        }
        if(categoryName?.length > 0 && categoryName[0]?.category_name === 'frame making' ){
            const services = await serviceModel.fetchFramesDetails()
            if(services.length === 0){
                return res.status(204).json({message: "there is no services."})
            }
            const servicesDetails = {
                serviceCategory: "frame making",
                services
            }
    
            res.status(200).json({message: "successfully fetched.", servicesDetails})
        }

        
    }catch(err){
        console.log("Error when fetch all services", err)
        res.status(500).json({message: "Internal server error."})
    }
}

const editServiceDetails = async(req, res) => {
    try{
        const { id, serviceId } = req.params

        const categoryName = await serviceModel.findNameById(id)

        if(categoryName?.length > 0 && categoryName[0]?.category_name === 'photosoot' ){

            const { photoshoot_name, price, duration, description} = req.body
            // const files = req.files

            const updatedFields = {}
            // const updatedFiles = []

            const services = await serviceModel.fetchPhotoShootDetails()

            if(services.length === 0){
                return res.status(204).json({message: "there is no services in this category."})
            }

            const updateableService = services.find(service => service.id === Number(serviceId))

            if(updateableService === undefined){
                return res.status(204).json({message: "there is no services in this service id."})
            }


            if(photoshoot_name) {
                const existingPhotoshootName = await serviceModel.findByPhotoShootName(photoshoot_name)

                if(existingPhotoshootName.length > 0){
                    return res.status(409).json({message: "Service already exist."})
                } 
                updatedFields.photoshoot_name = photoshoot_name
            }
            if(price) updatedFields.price = price
            if(duration) updatedFields.durarion = duration
            if(description) updatedFields.description = description
            // if(files) {
            //     updatedFiles = files.map(file => file.filename)
            // }

            if(Object.keys(updatedFields).length === 0){
                return res.status(400).json({message: 'No fields provide.'})

            }
            
            const result = await serviceModel.photoShootDetailsEditing(serviceId, updatedFields)

            res.status(200).json({message: "successfully edited.", result})
        }

        if(categoryName?.length > 0 && categoryName[0]?.category_name === 'printings' ){

            const { printing_name, price, description} = req.body
            // const files = req.files

            const updatedFields = {}
            // const updatedFiles = []

            const services = await serviceModel.fetchPrintingDetails()

            if(services.length === 0){
                return res.status(204).json({message: "there is no services in this category."})
            }

            const updateableService = services.find(service => service.id === Number(serviceId))

            if(updateableService === undefined){
                return res.status(204).json({message: "there is no services in this service id."})
            }


            if(printing_name) {
                const existingPrintingName = await serviceModel.findByPrintingName(printing_name)

                if(existingPrintingName.length > 0){
                    return res.status(409).json({message: "Service already exist."})
                } 
                updatedFields.printing_name = printing_name
            }
            if(price) updatedFields.price = price
            if(description) updatedFields.description = description
            // if(files) {
            //     updatedFiles = files.map(file => file.filename)
            // }

            if(Object.keys(updatedFields).length === 0){
                return res.status(400).json({message: 'No fields provide.'})

            }
            
            const result = await serviceModel.printingDetailsEditing(serviceId, updatedFields)

            res.status(200).json({message: "successfully edited.", result})
        }

        if(categoryName?.length > 0 && categoryName[0]?.category_name === 'frame making' ){

            const { material_name, size, color, price, description, frameDetailsId } = req.body
            // const files = req.files

            const updatedFields = {}
            // const updatedFiles = []

            const services = await serviceModel.fetchFramesDetails()

            if(services.length === 0){
                return res.status(204).json({message: "there is no services in this category."})
            }

            const updateableService = services.find(service => service.service_id === Number(serviceId))

            if(updateableService === undefined){
                return res.status(204).json({message: "there is no services in this service id."})
            }


            if(material_name) {
                const existingMaterialName = await serviceModel.findByMeterialName(material_name)

                if(existingMaterialName.length > 0){
                    return res.status(409).json({message: "Service already exist."})
                } 
                updatedFields.material_name = material_name
                // const editMeterialName = await serviceModel.frameMeterialNameEditing(serviceId, material_name)
            }
            

            if(frameDetailsId){
                if(price) updatedFields.price = price
                if(size) updatedFields.description = size
                if(color) updatedFields.description = color
                if(description) updatedFields.description = description

                if(Object.keys(updatedFields).length === 0 && material_name === null){
                    return res.status(400).json({message: 'No fields provide.'})

                }
                await serviceModel.frameDetailsEditing(frameDetailsId, updatedFields)
            }
            

            res.status(200).json({message: "successfully edited."})
        }

    }catch(err){
        console.log("Error when fetch all services", err)
        res.status(500).json({message: "Internal server error."})
    }
}







module.exports = { addServiceCategory, addServices, fetchServiceDetails, editServiceDetails, getAllServiceCategory}



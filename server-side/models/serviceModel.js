const db = require('../config/db')

const findByCategoryName = async (name) => {
    try{
        const sql = `select * from service_category where category_name = ?`

        return new Promise((resolve, reject) => {
            db.query(sql, [name],
                (err, result) => {
                    if(err) reject(err)
                        else resolve(result)
                }
            )
        })
    }catch(err){
        throw new Error('Database error occurred when finding client.');
    }
}

const findIdByCategoryName = async (name) => {
    try{
        const sql = `select id from service_category where category_name = ?`

        return new Promise((resolve, reject) => {
            db.query(sql, [name],
                (err, result) => {
                    if(err) reject(err)
                        else resolve(result)
                }
            )
        })
    }catch(err){
        throw new Error('Database error occurred when finding client.');
    }
}

const findAllServiceCategory = async() => {
     try{
        const sql = `select * from service_category`

        return new Promise((resolve, reject) => {
            db.query(sql,
                (err, result) => {
                    if(err) reject(err)
                        else resolve(result)
                }
            )
        })
    }catch(err){
        throw new Error('Database error occurred when fetching service_category.');
    }
}

const findNameById = async (id) => {
    try{
        const sql = `select category_name from service_category where id = ?`

        return new Promise((resolve, reject) => {
            db.query(sql, [id],
                (err, result) => {
                    if(err) reject(err)
                        else resolve(result)
                }
            )
        })
    }catch(err){
        throw new Error('Database error occurred when finding client.');
    }
}

const serviceCategoryAdd = (category_name) => {

    const sql = `insert into service_category (category_name) values (?)`

    return new Promise((resolve, reject) => {
        db.query(sql, [category_name], 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const findByPhotoShootName = (name) => {
    const sql = `select * from photoshoot where photoshoot_name = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [name], 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const createPhotoShootServices = (serviceData) => {
    const {photoshoot_name, price, durarion, description, service_category_id} = serviceData

    const sql = `insert into photoshoot (photoshoot_name, price, durarion, description, service_category_id) values (?, ?, ?, ?, ?)`

    return new Promise((resolve, reject) => {
        db.query(sql, [photoshoot_name, price, durarion, description, service_category_id], 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const addServicePhotos = (servicePhotosData) => {
    const {file_paths, serviceCategoryId, service_id} = servicePhotosData

    const values = file_paths.map(file => [file, serviceCategoryId, service_id])

    const placeholders = values.map(() => '(?, ?, ?)').join(', ');

    const sql = `insert into sample_photos (file_path, service_category_id, service_id) values ${placeholders}`

    const flattenedValues = values.flat();

    return new Promise((resolve, reject) => {
        db.query(sql, flattenedValues, 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const findByPrintingName = (name) => {
    const sql = `select * from printings where printing_name = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [name], 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const createPrintingServices = (serviceData) => {
    const {printing_name, price, description, service_category_id} = serviceData

    const sql = `insert into printings (printing_name, price, description, service_category_id) values (?, ?, ?, ?)`

    return new Promise((resolve, reject) => {
        db.query(sql, [printing_name, price, description, service_category_id], 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const findByMeterialName = (material_name) => {
    const sql = `select * from frames where material_name = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [material_name], 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

// const createFramMakingService = (framesData) => {
//     const {material_name, service_category_id} = framesData

//     const sql = `insert into frames (material_name, service_category_id) values (?, ?)`

//     return new Promise((resolve, reject) => {
//         db.query(sql, [material_name, service_category_id], 
//             (err, result) => {
//                 if(err) reject(err)
//                     else resolve(result)
//             }
//         )
//     })
// }

const createFramesDetails = (framesData) => {
    const {material_name, size, color, price, description, service_category_id} = framesData

    const sql = `insert into frames (material_name, size, color, price, description, service_category_id) values (?, ?, ?, ?, ?, ?)`

    return new Promise((resolve, reject) => {
        db.query(sql, [ material_name, size, color, price, description, service_category_id ], 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const fetchPhotoShootDetails = () => {
    const sql = `select 
        p.id as serviceId, 
        p.photoshoot_name as serviceName, 
        p.price as servicePrice, 
        p.durarion as duration, 
        p.description as description, 
        p.created_at as createdAt, 
        p.service_category_id as serviceCategoryId, 
        s.service_id as serviceId, 
        JSON_ARRAYAGG(s.file_path) As photoPaths  
        from photoshoot p join sample_photos s on p.id = s.service_id group by p.id`

    return new Promise((resolve, reject) => {
        db.query(sql,  
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const fetchPrintingDetails = () => {
    const sql = `select 
            p.id as serviceId,
            p.printing_name as serviceName,
            p.price as servicePrice,
            p.description as description,
            p.created_at as createdAt,
            p.service_category_id as serviceCategoryId,
            s.service_id as serviceId, 
            JSON_ARRAYAGG(s.file_path) As photoPaths 
            from printings p join sample_photos s on p.id = s.service_id group by p.id`

    return new Promise((resolve, reject) => {
        db.query(sql, 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const fetchFramesDetails = () => {
    const sql = `select 
            f.id as serviceId,
            f.material_name as serviceName,
            f.service_category_id as serviceCategoryId,
            f.size as frameSize,
            f.color as framneColor,
            f.price as servicePrice,
            f.description as description,
            f.created_at as createdAt, 
            JSON_ARRAYAGG(s.file_path) As photoPaths 
            from frames f join sample_photos s on f.id = s.service_id group by f.id`

    return new Promise((resolve, reject) => {
        db.query(sql, 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const photoShootDetailsEditing = (id, updatedFields) => {
    const setClauses = [];
    const values = [];

    for(const [key, value] of Object.entries(updatedFields)){
        setClauses.push(`${key} = ?`)
        values.push(value)
    }

    const sql = `update photoshoot set ${setClauses.join(', ')} where id = ?`
    values.push(id)

    return new Promise((resolve, reject) => {
        db.query(sql, values,
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const printingDetailsEditing = (id, updatedFields) => {
    const setClauses = [];
    const values = [];

    for(const [key, value] of Object.entries(updatedFields)){
        setClauses.push(`${key} = ?`)
        values.push(value)
    }

    const sql = `update printings set ${setClauses.join(', ')} where id = ?`
    values.push(id)

    return new Promise((resolve, reject) => {
        db.query(sql, values,
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

// const frameMeterialNameEditing = (id, material_name) => {    
//     const sql = `update frames set material_name = ? where id = ?`

//     return new Promise((resolve, reject) => {
//         db.query(sql, [material_name, id],
//             (err, result) => {
//                 if(err) reject(err)
//                     else resolve(result)
//             }
//         )
//     })
// }

const frameDetailsEditing = (id, updatedFields) => {
    const setClauses = [];
    const values = [];

    for(const [key, value] of Object.entries(updatedFields)){
        setClauses.push(`${key} = ?`)
        values.push(value)
    }

    const sql = `update frame_size set ${setClauses.join(', ')} where id = ?`
    values.push(id)

    return new Promise((resolve, reject) => {
        db.query(sql, values,
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}







module.exports = { 
    findByCategoryName, 
    serviceCategoryAdd, 
    findIdByCategoryName, 
    findNameById, 
    findByPhotoShootName, 
    createPhotoShootServices, 
    addServicePhotos,
    findByPrintingName,
    createPrintingServices,
    findByMeterialName,
    createFramesDetails,
    fetchPhotoShootDetails,
    fetchPrintingDetails,
    fetchFramesDetails,
    photoShootDetailsEditing,
    printingDetailsEditing,
    frameDetailsEditing,
    findAllServiceCategory
}
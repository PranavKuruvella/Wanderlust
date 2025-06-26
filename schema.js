//server side validation for listing -- Using Joi
const joi = require("joi")

module.exports.listingSchemaJoi = joi.object({
    listing: joi.object({ //listing ane obj undali and required avvali listing li kuda oka obj undali
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().min(0).required(),
        image: joi.string().allow("",null),
        
    }).required()
})

module.exports.reviewSchemaJoi = joi.object({
    review: joi.object({
        rating: joi.number().min(1).max(5).required(),
        comment: joi.string().required()
    }).required()
})
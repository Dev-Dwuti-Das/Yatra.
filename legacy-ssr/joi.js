const Joi = require('joi');

module.exports.joischema = Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        image:Joi.string(),
        price:Joi.number().required().min(1000),
        location:Joi.string().required(),
        country:Joi.string().required()
});
const Joi = require('joi');

function cstValidate(pbi){
    const schema = Joi.object({
        ctn       :  Joi.number().integer(),
        errorCode :  Joi.number().integer().required(),
        errorDesc :  Joi.string().min(5).required(),
        journey   :  Joi.string().min(5),
        // issue_recent_time: Joi.date,
        segment :     Joi.string(),
        email   :     Joi.string(),

    });

    return schema.validate(pbi);
};

function pbiValidate(pbi){
    const schema = Joi.object({
        PBI       :  Joi.string().required(),
        BUG       :  Joi.string().required(),
        errorCode :  Joi.number().integer().required(),
        errorDesc :  Joi.string().min(5).required(),        
        Status    :  Joi.string().required(),
        Asignee   :  Joi.string().required(),
        RemedyQ   :  Joi.string().required(),

    });

    return schema.validate(pbi);
};


module.exports = {
    cstValidate : cstValidate,
    pbiValidate : pbiValidate
}
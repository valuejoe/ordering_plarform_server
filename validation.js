//VALIDATION
const Joi = require("@hapi/joi");

//Register Validation
const registerValidation = data => {
    const schema = {
        name: Joi.string()
            .min(6)
            .required(),
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    };
    return Joi.validate(data, schema);
};

//login validation
const loginValidation = data => {
    const schema = {
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    };
    return Joi.validate(data, schema);
};

// category validation
const categoryValidation = data => {
    const schema = {
        name: Joi.string().required()
    };
    return Joi.validate(data, schema);
};

//menu validation
const menuValidation = data => {
    const schema = {
        index: Joi.number(),
        title: Joi.string()
            .max(256)
            .required(),
        cost: Joi.number().required(),
        category: Joi.string().required()
    };
    return Joi.validate(data, schema);
};

//order validation
const orderValidation = data => {
    const schema = {
        order: Joi.array()
            .items(
                Joi.object({
                    title: Joi.string().required(),
                    count: Joi.number().required(),
                    cost: Joi.number().required()
                }).unknown(true)
            )
            .required()
    };
    return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.categoryValidation = categoryValidation;
module.exports.menuValidation = menuValidation;
module.exports.orderValidation = orderValidation;

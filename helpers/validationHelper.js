const { Joi } = require('express-validation');
const passwordComplexity = require("joi-password-complexity");
const passwordConfig = {
  min: 12,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
}

module.exports = {
    validateRegisteration : (data) => {
        const schema = Joi.object(
            {
                name : Joi.string().min(5).max(20).required().label('Username'),
                email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }).required().label('Email'),
                password: Joi.string().min(12).required().label('Password'),
                user_type : Joi.string().valid(...['user','admin','user','student','franchise'])
            }
        )
        const validatedData =  schema.validate(data)
        if(validatedData.error){
            return validatedData
        }

        return passwordComplexity(passwordConfig,"password").validate(data.password);
    },
    validateLogin : (data) => {
        const schema = Joi.object(
            {
                email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }).required(),
                password : Joi.string().min(12).required()
            }
        )
        return schema.validate(data)
    }
}
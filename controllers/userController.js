var UserModel = require('../models/userModel.js');
const validation = require('./../helpers/validationHelper')
const log = require('./../constants/log')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },

    /**
     * userController.create()
     */
    create: function (req, res) {
        var user = new UserModel({
			name : req.body.name,
			email : req.body.email,
			password : req.body.password,
			type : req.body.type
        });

        user.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating user',
                    error: err
                });
            }

            return res.status(201).json(user);
        });
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.name = req.body.name ? req.body.name : user.name;
			user.email = req.body.email ? req.body.email : user.email;
			user.password = req.body.password ? req.body.password : user.password;
			user.type = req.body.type ? req.body.type : user.type;
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    /**
     * userController.login()
     */
    login: async (req,res) =>{
        //validate user input
        const error = validation.validateLogin(req.body).error 
        if(error)
            return res.status(400).json({ message : error.details[0].message })
        
        //check for existing user
        const user = await UserModel.findOne({ email : req.sanitize(req.body.email) })
        if(!user)
            return res.status(401).json({message : log.authLogs.USER_NOT_EXISTS })
        
        //compare password 
        const validPass = await bcrypt.compare(req.sanitize(req.body.password), user.password)
        if(!validPass)
            return res.status(401).json({message : log.authLogs.USER_NOT_EXISTS })

        //create JWT
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET);
        return res.status(200).json({ messgae: 'Login is successfull', token , username: user.name })
    },

    /**
     * userController.register()
     */
    register: async (req,res) =>{

        //validate request
        const error = validation.validateRegisteration(req.body).error
        if(error)
            return res.status(400).json({ message : error.details[0].message })
        
        //check user already exists
        const user = await UserModel.findOne( {email : req.sanitize(req.body.email)} )
        if(user)
            return res.status(400).json({ message : log.authLogs.USER_EXISTS })
        
        //encrypt password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.sanitize(req.body.password), salt)

        //create user
        const newUser = new UserModel(
            {
                name : req.body.name,
                email : req.body.email,
                user_type : req.body.user_type,
                password : hashedPassword
            }
        )
        
        //Save user
        try{
            newUser.save()

            //create JWT token
            const token = jwt.sign({ _id: newUser.id }, process.env.JWT_SECRET,{ expiresIn: '1h' });

            //return response with JWT auth
            return res.status(201).send({ message : log.authLogs.USER_CREATED,
                token : token,
                user :{
                    name : newUser.name,
                    email : newUser.email,
                }
            })
        }catch(err){
            return res.status(400).send({message : log.authLogs.USER_CREATION_FAILED })
        }
    },

    /**
     * userController.login()
     */
    logout: async (req,res) =>{
        return res.status(200).send("done")
    }
};

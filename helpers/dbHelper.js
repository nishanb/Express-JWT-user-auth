const mongoose =  require('mongoose');
const message = require('./../constants/log');

const connect = async () => {
    await mongoose.connect(
        process.env.MONGO_DB_URL,{ useNewUrlParser: true, useUnifiedTopology: true }, (err) =>{
            err == undefined ? console.log(message.info.MONGO_CONNECT_SUCCESSFULL) : console.log(err) 
        }
    );
};

module.exports.connect = connect ;
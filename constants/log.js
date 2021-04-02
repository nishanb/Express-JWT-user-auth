const error = {
    MONGO_CONNECT_FAILED : "Failed to connect to mongo DB",
    RATE_LIMIT : "Too many requests from same ip address",
    NOT_FOUND : "Not Found"
}

const info = {
    MONGO_CONNECT_SUCCESSFULL : "Connected to DB 🔥",
    SERVER_STARTED : "Server started on port "
}

const authLogs = {
    USER_EXISTS : "User already exists",
    USER_CREATED : "User Created successfully",
    USER_CREATION_FAILED : "User creation failed",
    USER_NOT_EXISTS : "Email or password does not match"
}

module.exports.error = error
module.exports.info = info
module.exports.authLogs = authLogs
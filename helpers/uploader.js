const multer = require("multer")
const fs = require("fs")

///ID documents upload
var agentStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        console.log("file:", file)
        const path = `./public/documents/agent/${req.params.id}`
        fs.mkdirSync(path, { recursive: true })
        return callback(null, path)
    },
    filename: function(req, file, callback) {
        let ext = file.mimetype.split("/")[1]
        return callback(null, req.params.id + new Date().toISOString() + "." + ext)
    }
})

///ID documents upload
var authAgentStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        console.log("file:", file)
        const path = `./public/documents/auth-agent/${req.params.id}`
        fs.mkdirSync(path, { recursive: true })
        return callback(null, path)
    },
    filename: function(req, file, callback) {
        let ext = file.mimetype.split("/")[1]
        return callback(null, req.params.id + new Date().toISOString() + "." + ext)
    }
})

var imagesUpload = multer({
    limits: { fileSize: 5 * 1024 * 1024 }, //5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    }
}).array("uploadedImages")

var agentIDUpload = multer({
    storage: agentStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, //5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    }
}).array("images", 3)

var agentPassportUpload = multer({
    storage: agentStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, //5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    }
}).single("images", 2);

var authAgentIDUpload = multer({
    storage: authAgentStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, //5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    }
}).array("images", 3)

var authAgentPassportUpload = multer({
    storage: authAgentStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, //5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    }
}).single("image", 2);

exports.agentUploadPassprt = agentPassportUpload
exports.agentUploadID = agentIDUpload

exports.authAgentUploadPassprt = authAgentPassportUpload
exports.authAgentUploadID = authAgentIDUpload
exports.imagesUpload = imagesUpload

///profile pictures upload
var profilePicStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        console.log("file:", file)
        const path = `./public/profile_pictures/${req.params.id}`
        fs.mkdirSync(path, { recursive: true })
        return callback(null, path)
    },
    filename: function(req, file, callback) {
        let ext = file.mimetype.split("/")[1]
        return callback(null, req.params.id + new Date().toISOString() + "." + ext)
    }
})

var profilePicUpload = multer({
    storage: profilePicStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, //5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    }
}).single("image");
exports.profilePicUpload = profilePicUpload
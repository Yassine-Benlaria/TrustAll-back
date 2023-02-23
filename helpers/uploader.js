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
        return callback(null, /* req.params.id + new Date().toISOString()+ */ file.originalname.split('.')[0] + "." + ext)
    }
})

///ID documents upload
var bloggerStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        console.log("file:", file)
        const path = `./public/documents/blogger/${req.params.id}`
        fs.mkdirSync(path, { recursive: true })
        return callback(null, path)
    },
    filename: function(req, file, callback) {
        let ext = file.mimetype.split("/")[1]
        return callback(null, /* req.params.id + new Date().toISOString()+ */ file.originalname.split('.')[0] + "." + ext)
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
        console.table({ file })
        let ext = file.mimetype.split("/")[1]
        return callback(null, /* req.params.id + new Date().toISOString()+ */ file.originalname.split('.')[0] + "." + ext)
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
}).array("uploadedImages");

var authAgentUpload = multer({
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
}).array("images");

var agentUpload = multer({
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
}).array("images");


var bloggerUpload = multer({
    storage: bloggerStorage,
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
}).array("images");

exports.agentUploadPassprt = agentUpload
exports.agentUploadID = agentUpload
exports.bloggerUploadID = bloggerUpload
exports.bloggerUploadPassport = bloggerUpload
exports.authAgentUploadPassprt = authAgentUpload
exports.authAgentUploadID = authAgentUpload
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
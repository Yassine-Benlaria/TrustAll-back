const multer = require("multer")
const fs = require("fs")

///ID documents upload
var storage = multer.diskStorage({
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
var IDUpload = multer({
    storage: storage,
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
}).array("images", 2)

var passportUpload = multer({
    storage: storage,
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

exports.agentUploadPassprt = passportUpload
exports.agentUploadID = IDUpload

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
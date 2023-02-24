const { requireMessages, generateConfirmationCode, sendConfirmationMail } = require("../helpers");
const { uploadID, uploadProfilePic, uploadFilesToImageKit } = require("../helpers/imageUploader");
const { agentUploadID, agentUploadPassprt, profilePicUpload, imagesUpload, bloggerUploadID, bloggerUploadPassport } = require("../helpers/uploader");
const Blogger = require("../models/blogger"),
    Admin = require("../models/admin"),
    Notification = require("../models/notification"),
    UsedEmail = require("../models/used-email"),
    Blog = require("../models/blog"),
    fs = require("fs");
const { v1: uuidv1 } = require("uuid");
const crypto = require("crypto")
const { getCitiesList } = require("../validators/cities");
const projection = {
    salt: false,
    hashed_password: false,
    updatedAt: false,
    __v: false,

};

//get agents list
exports.getBloggersList = (req, res) => {

    Blogger.find({}, (err, result) => {
        if (err || !result) {
            return res.status(400).json(err)
        }
        let citiesList = getCitiesList(req.params.lang)
        let bloggers = result.map(user => {
            let city = citiesList.find(e => e.wilaya_code == user.city).wilaya_name
            return {...user._doc, city }
        })
        return res.json(bloggers)
    })
}

//update agent's info (first_name, last_name, birth_date)
exports.updateBlogger = (req, res) => {
    let json = {}

    if (req.body.first_name) json.first_name = req.body.first_name
    if (req.body.last_name) json.last_name = req.body.last_name
    if (req.body.birth_date) json.birth_date = req.body.birth_date

    Blogger.updateOne({ _id: req.params.id }, { $set: json }, (err, result) => {
        if (err || !result) {
            return res.status(400).json({ err })
        }
        return res.json({ msg: "Blogger updated successfully!" })
    })
}

//blogger by id
exports.bloggerByID = (req, res, next, id) => {

    Blogger.findById(id, projection).exec((err, blogger) => {
        if (err || !blogger) {
            return res.status(400).json({ err: "User not found" })
        }
        req.profile = {...blogger._doc, type: "blogger" };
        next();
    })
}

//uploading passport
exports.uploadPassport = (req, res) => {

    if (req.profile.id_uploaded) return res.status(400).json({ err: "ID already uploaded" })
    bloggerUploadPassport(req, res, async(err) => {

        if (err) console.log(err)
        console.log(req)
            // let file = Buffer.from(req.files[0].buffer).toString("base64")
            // console.log(file)
        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ err: "you have to upload 2 pictures" })
        }

        // let urls = await uploadID(req.files, req.params.id);

        // console.log(urls)
        Blogger.updateOne({ _id: req.params.id }, {
            $set: {
                id_uploaded: true,
                identity_document: {
                    type: "passport",
                    // [urls[0][0]]: urls[0][1],
                    // [urls[1][0]]: urls[1][1],
                }
                // {
                //     type: "passport",
                //     front_url: { photo: urls[0][1], key: urls[0][2] },
                //     selfie_url: { photo: urls[1][1], key: urls[1][2] },
                // }
            }
        }, (err, result) => {
            if (err) console.log(err)
            else console.log(result)
        })
        res.send({ msg: "Passport uploaded successfully" });
        //notifications
        let notification = new Notification({
            subject: `${req.profile.first_name} ${req.profile.last_name} uploaded his passport!`,
            description: `The agent ${req.profile.first_name} ${req.profile.last_name} has uploaded his passport, go check it!`
        });

        return Admin.updateMany({}, { $push: { notifications: notification } })
            .then(result => console.log("done"))
            .catch(err => console.log(err));
    });

}

//uploading ID card or Driving license
exports.uploadId = (req, res) => {

    if (req.profile.id_uploaded) return res.status(400).json({ err: "ID already uploaded" })
    bloggerUploadID(req, res, async(err) => {

        if (err)
            return res.status(400).json({ err })
        console.log(req)
            // let file = Buffer.from(req.files[0].buffer).toString("base64")
            // console.log(file)
        if (!req.files || req.files.length != 3) {
            return res.status(400).json({ err: "you have to upload 3 pictures" })
        }

        // let urls = await uploadID(req.files, req.params.id);

        // console.log(urls)
        Blogger.updateOne({ _id: req.params.id }, {
            $set: {
                id_uploaded: true,
                identity_document: {
                    type: "ID",
                    // [urls[0][0]]: urls[0][1],
                    // [urls[1][0]]: urls[1][1],
                    // [urls[2][0]]: urls[2][1],
                }
            }
        }, (err, result) => {
            if (err) console.log(err)
            else console.log(result)
        })
        res.json({ msg: "ID uploaded successfully" });

        //notifications
        let notification = new Notification({
            subject: `${req.profile.first_name} ${req.profile.last_name} uploaded his ID!`,
            description: `The agent ${req.profile.first_name} ${req.profile.last_name} has uploaded his Identity Document, go check it!`
        });

        return Admin.updateMany({}, { $push: { notifications: notification } })
            .then(result => console.log("done"))
            .catch(err => console.log(err));
    });
}


//get ID documents
exports.getBloggerIDPhotos = (req, res) => {

    const id = req.query.id;

    Blogger.findById(id, (err, blogger) => {
        if (err || !blogger) {
            return res.status(400).json({ err: "err" });
        }
        if (blogger.id_uploaded == false)
            return res.status(400).json({ err: "ID not found" });


        const photosPath = `public/documents/blogger/${id}/`;

        let json = { type: blogger.identity_document.type }
        fs.readdir(photosPath, function(err, files) {
            //handling error
            if (err) {
                return res.status(400).json({ err: "Can not find images!" });
            }
            //listing all files using forEach
            files.forEach(function(file) {
                let photo = fs.readFileSync(photosPath + file);
                let photoBase64 = photo.toString('base64');
                json[file.split('.')[0]] = photoBase64;
            });
            if (json.type == "passport")
                return res.json({ type: json.type, front: json.front, selfie: json.selfie });
            else if (json.type == "ID")
                return res.json({ type: json.type, front: json.front, back: json.back, selfie: json.selfie });
        });
    });

}

//change password
exports.changeBloggerPassword = (req, res) => {
    const { noAccountFound, passwordNotCorrect, updatedSuccess } = requireMessages(req.body.lang)
    Blogger.findById(req.params.id, (err, blogger) => {
        if (err || !blogger)
            return res.status(400).json({ err: noAccountFound });
        if (!blogger.authenticate(req.body.old_password))
            return res.status(400).json({ err: passwordNotCorrect })
        let salt = uuidv1(),
            hashed_password = crypto
            .createHmac('sha1', salt)
            .update(req.body.password)
            .digest("hex");
        blogger.hashed_password = hashed_password;
        blogger.salt = salt;
        blogger.save();
        return res.json({ msg: updatedSuccess });
    })
}

//add new email
exports.addEmail = async(req, res) => {
    //test if email is used
    let usedEmail;
    try {
        usedEmail = await UsedEmail.findOne({ email: req.body.email });
    } catch (err) {
        return res.status(400).json({
            err: requireMessages(req.body.lang).emailAlreadyExist
        })
    }
    if (usedEmail) return res.status(400).json({
        err: requireMessages(req.body.lang).emailAlreadyExist
    })

    const code = generateConfirmationCode()
    Blogger.findById(req.params.id, (err, blogger) => {
        //if no account found
        if (err || !blogger) return res.status(400).json({ err: requireMessages(req.body.lang).noAccountFound });
        if (blogger.email == req.body.email) return res.status(400).json({ err: "You are already using this email!" })

        //else
        blogger.newEmail = req.body.email;
        blogger.newEmailConfirmation = code;
        blogger.newEmailConfirmationExpiration = Date.now() + 180000;
        blogger.save()
        sendConfirmationMail(req.body.email, code, req.body.lang);
        return res.json({ msg: "confirmation code sent to email!" })
    });
}

//confirm the new email
exports.confirmNewEmail = (req, res) => {
    Blogger.findOne({ _id: req.params.id, newEmailConfirmationExpiration: { $gt: Date.now() } })
        .then(blogger => {
            if (!blogger) return res.status(400).json({ msg: "This code have been expired, you can request a new one!" });
            if (blogger.newEmailConfirmation != req.body.code) return res.status(400).json({ err: "Confirmation code is not correct!" });
            ///////////////////////////////////////////
            let newMail = blogger.newEmail,
                oldMail = blogger.email;
            ///////////////////////////////////////////
            blogger.email = blogger.newEmail;
            blogger.newEmail = undefined;
            blogger.newEmailConfirmation = undefined;
            blogger.newEmailConfirmationExpiration = undefined;
            blogger.save().then(result => {
                //adding email to used emails
                usedEmail = new UsedEmail({ email: newMail })
                usedEmail.save();
                //delete old email from used emails
                UsedEmail.findOneAndDelete({ email: oldMail }, (err, email) => {
                    if (err) return console.table({ err: err });
                });
                return res.json({ msg: requireMessages(req.body.lang).emailModified })
            }).catch(err => {
                return res.status(400).json({ err: requireMessages(req.body.lang).emailAlreadyExist });
            });
        })
}

//resend confirmation code
exports.resendConfirmEmail = (req, res) => {
    Blogger.findById(req.params.id, (err, blogger) => {
        if (err || !blogger) return res.status(400).json({ msg: requireMessages(req.body.lang).noAccountFound });

        //if an account found
        var code = generateConfirmationCode();

        if (req.body.type == "new-email") {
            if (blogger.newEmail) {
                //if 60 seconds doesn't pass yet
                if (Date.parse(blogger.newEmailConfirmationExpiration) - 120000 > (Date.now()))
                    return res.status(400).json({ err: "you have to wait 60 seconds!" });
                //else
                blogger.newEmailConfirmation = code;
                blogger.newEmailConfirmationExpiration = Date.now() + 180000;
                blogger.save();
                sendConfirmationMail(blogger.newEmail, code, req.body.lang);
            } else return res.status(400).json({ err: "want to resend code, but no newEmail found!" });
        } else {
            blogger.confirmation_code = code;
            blogger.save();
            sendConfirmationMail(blogger.email, code, req.body.lang);
        }
        return res.json({ msg: requireMessages(req.body.lang).emailSent })
    })
}

//uploading profile picture
exports.uploadProfilePicture = (req, res) => {

    profilePicUpload(req, res, async(err) => {

        if (err) console.log(err)
        console.log(req)
            // let file = Buffer.from(req.files[0].buffer).toString("base64")
            // console.log(file)
        if (!req.file) {
            return res.status(400).json({ err: "you have to upload a picture" })
        }

        let urls = await uploadProfilePic(req.file, req.params.id);

        console.log(urls)
        Blogger.updateOne({ _id: req.params.id }, {
            $set: {
                img: urls[0][1]

                // {
                //     type: "passport",
                //     front_url: { photo: urls[0][1], key: urls[0][2] },
                //     selfie_url: { photo: urls[1][1], key: urls[1][2] },
                // }
            }
        }, (err, result) => {
            if (err) console.log(err)
            else console.log(result)
        })
        return res.send({ msg: "picture uploaded successfully", img: urls[0][1] })
    });
}

//create blog
exports.createBlog = (req, res) => {
    imagesUpload(req, res, (err) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ err: "err" });
        }

        Blog.findById(req.body.blog_id, (err, blog) => {
            if (err || !blog) createNewBlog(req, res);
            else {
                console.log(blog)
                updateBlog(req, res, blog);
            }
        })
    });
}

//create new blog
const createNewBlog = async(req, res) => {
    let json = {};
    if (req.files.length > 0) {
        let image = await uploadFilesToImageKit(req.files);
        json.image = image[0][1]
    }
    json.title = req.body.title;
    json.content = req.body.content;
    let blog = new Blog(json)
    blog.save().then(result => {
        res.json({ msg: "Blog created successfully!" });
    }).catch(err => {
        console.log(err);
        return res.status(400).json({ err: "err" });
    })
}


//update blog
const updateBlog = async(req, res, blog) => {
    if (req.files.length > 0) {
        let image = await uploadFilesToImageKit(req.files);
        blog.image = image[0][1]
    }
    if (req.body.title)
        blog.title = req.body.title;
    if (req.body.content)
        blog.content = req.body.content;
    blog.save().then(result => {
        res.json({ msg: "Blog updated successfully!" });
    }).catch(err => {
        console.log(err);
        return res.status(400).json({ err: "Error while updating blog" });
    })
}
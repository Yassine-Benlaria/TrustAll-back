const { uploadID } = require("../helpers/imageUploader");
const { agentUploadID, agentUploadPassprt } = require("../helpers/uploader");
const Blogger = require("../models/blogger"),
    Admin = require("../models/admin"),
    Notification = require("../models/notification");
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
    agentUploadPassprt(req, res, async(err) => {

        if (err) console.log(err)
        console.log(req)
            // let file = Buffer.from(req.files[0].buffer).toString("base64")
            // console.log(file)
        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ err: "you have to upload 2 pictures" })
        }

        let urls = await uploadID(req.files, req.params.id);

        console.log(urls)
        Blogger.updateOne({ _id: req.params.id }, {
            $set: {
                id_uploaded: true,
                identity_document: {
                    type: "passport",
                    [urls[0][0]]: urls[0][1],
                    [urls[1][0]]: urls[1][1],
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
    agentUploadID(req, res, async(err) => {

        if (err)
            return res.status(400).json({ err })
        console.log(req)
            // let file = Buffer.from(req.files[0].buffer).toString("base64")
            // console.log(file)
        if (!req.files || req.files.length != 3) {
            return res.status(400).json({ err: "you have to upload 3 pictures" })
        }

        let urls = await uploadID(req.files, req.params.id);

        console.log(urls)
        Blogger.updateOne({ _id: req.params.id }, {
            $set: {
                id_uploaded: true,
                identity_document: {
                    type: "ID",
                    [urls[0][0]]: urls[0][1],
                    [urls[1][0]]: urls[1][1],
                    [urls[2][0]]: urls[2][1],
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
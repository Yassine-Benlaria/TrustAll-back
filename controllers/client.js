const Client = require("../models/client")

exports.signup = (req, res) => {

    let json = req.body

    // const client = new Client(json)
    // client.save((err, savedClient) => {
    //     if (err) {
    //         return res.status(400).json({
    //             err: "Email already exists!"
    //         })
    //     }
    //     res.json({ savedClient })
    // })
    res.json("jklm")
}